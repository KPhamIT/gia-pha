"use client";

import { useEffect, useMemo, useState } from 'react';
import FamilyTreeHeader from './FamilyTreeHeader';
import ProfileForm from '../forms/ProfileForm';
import NewPersonForm from '../forms/NewPersonForm';
import RelationshipForm from '../forms/RelationshipForm';
import PersonSidebar from '../sidebar/PersonSidebar';
import FamilyTreeGraph from './FamilyTreeGraph';
import NodeActionModal from './NodeActionModal';
import { AuthResponse, FamilyTreeData, Person, RelationshipType } from '../types/family-tree-types';
import { getRootPerson } from '@/utils/family-tree-utils';
import { api } from '@/lib/api';

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const ALLOW_PUBLIC_ACCESS = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS === 'true';

type ProfileFormState = {
  fullName: string;
  gender: string;
  birthDate: string;
  avatar: string;
};

type NewPersonFormState = ProfileFormState & {
  generation?: string;
  branch?: string;
};

export default function FamilyTreeApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [rootId, setRootId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    fullName: '',
    gender: '',
    birthDate: '',
    avatar: '',
  });
  const [newPersonForm, setNewPersonForm] = useState<NewPersonFormState>({
    fullName: '',
    gender: '',
    birthDate: '',
    avatar: '',
    generation: '',
    branch: '1',
  });
  const [relationTargetId, setRelationTargetId] = useState<number | null>(null);
  const [relationType, setRelationType] = useState<RelationshipType>('SPOUSE');
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [nodeActionPerson, setNodeActionPerson] = useState<Person | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('family-tree-token');
    if (savedToken) {
      setToken(savedToken);
      return;
    }

    if (ALLOW_PUBLIC_ACCESS) {
      refreshApp();
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshApp();
    }
  }, [token]);

  const refreshApp = async () => {
    setLoading(true);
    try {
      let meResponse: Awaited<ReturnType<typeof api.auth.me>> | null = null;
      if (token || ALLOW_PUBLIC_ACCESS) {
        try {
          meResponse = await api.auth.me();
        } catch {
          meResponse = null;
        }
      }

      if (meResponse?.user) {
        setUser(meResponse.user);
      } else if (ALLOW_PUBLIC_ACCESS) {
        setUser({ id: 0, email: 'dev@local', provider: 'dev' });
      }

      if (meResponse?.person) {
        setPerson(meResponse.person);
        setProfileForm({
          fullName: meResponse.person.fullName,
          gender: meResponse.person.gender || '',
          birthDate: meResponse.person.birthDate || '',
          avatar: meResponse.person.avatar || '',
        });
        setRootId(meResponse.person.id);
      }

      const personsResponse = await api.person.list();
      setPersons(personsResponse);

      if (!meResponse?.person && ALLOW_PUBLIC_ACCESS) {
        const fallbackPerson = getRootPerson(personsResponse);
        if (fallbackPerson) {
          setPerson(fallbackPerson);
          setProfileForm({
            fullName: fallbackPerson.fullName,
            gender: fallbackPerson.gender || '',
            birthDate: fallbackPerson.birthDate || '',
            avatar: fallbackPerson.avatar || '',
          });
          setRootId(fallbackPerson.id);
          await loadFamilyTree(fallbackPerson.id);
        }
      }

      if (meResponse?.person) {
        await loadFamilyTree(meResponse.person.id);
      }
    } catch (error) {
      setMessage((error as Error).message || 'Không thể lấy dữ liệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFamilyTree = async (personId: number) => {
    try {
      const treeResponse = await api.person.getTree(personId);
      setTreeData(treeResponse);
    } catch (error) {
      console.error(error);
      setTreeData(null);
    }
  };

  const saveLocalToken = (accessToken: string) => {
    localStorage.setItem('family-tree-token', accessToken);
    setToken(accessToken);
  };

  const handleFacebookLogin = async () => {
    if (!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID) {
      setMessage('Vui lòng cấu hình NEXT_PUBLIC_FACEBOOK_APP_ID trong frontend/.env.local');
      return;
    }

    try {
      setLoading(true);
      await loadFacebookSdk();
      window.FB.login(
        async (response: any) => {
          if (response.authResponse?.accessToken) {
            await handleFacebookToken(response.authResponse.accessToken);
          } else {
            setMessage('Đăng nhập Facebook không thành công');
          }
          setLoading(false);
        },
        { scope: 'email' },
      );
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi tải Facebook SDK');
      setLoading(false);
    }
  };

  const loadFacebookSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Không thể tải Facebook SDK trên server'));
        return;
      }

      if (window.FB) {
        resolve();
        return;
      }

      const existing = document.getElementById('facebook-jssdk');
      if (existing) {
        const checkReady = () => {
          if (window.FB) {
            resolve();
          } else {
            setTimeout(checkReady, 200);
          }
        };
        checkReady();
        return;
      }

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
          cookie: true,
          xfbml: false,
          version: 'v17.0',
        });
        resolve();
      };

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Không tải được Facebook SDK'));
      document.body.appendChild(script);
    });
  };

  const handleFacebookToken = async (accessToken: string) => {
    try {
      setMessage(null);
      const data = await api.auth.loginFacebook(accessToken);
      saveLocalToken(data.accessToken);
      setUser(data.user);
      setPerson(data.person);
      setProfileForm({
        fullName: data.person.fullName,
        gender: data.person.gender || '',
        birthDate: data.person.birthDate || '',
        avatar: data.person.avatar || '',
      });
      setRootId(data.person.id);
      setMessage('Đăng nhập thành công');
      await loadFamilyTree(data.person.id);
      const personsResponse = await api.person.list();
      setPersons(personsResponse);
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi xác thực với backend');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('family-tree-token');
    setToken(null);
    setUser(null);
    setPerson(null);
    setTreeData(null);
    setMessage('Đã đăng xuất');
  };

  const showApp = !!token || ALLOW_PUBLIC_ACCESS;

  const handleSaveProfile = async () => {
    if (!person) {
      setMessage('Vui lòng đăng nhập trước khi lưu hồ sơ');
      return;
    }

    try {
      setLoading(true);
      const updated = await api.person.update(person.id, profileForm);
      setPerson(updated);
      setMessage('Hồ sơ đã được cập nhật');
      await loadFamilyTree(updated.id);
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi cập nhật hồ sơ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async () => {
    if (!newPersonForm.fullName.trim()) {
      setMessage('Tên người mới không được để trống');
      return;
    }

    try {
      setLoading(true);
      const body = {
        ...newPersonForm,
        generation: newPersonForm.generation ? Number(newPersonForm.generation) : undefined,
        branch: newPersonForm.branch ? Number(newPersonForm.branch) : 1,
      };
      const created = await api.person.create(body);
      setPersons((current) => [...current, created]);
      setNewPersonForm({ fullName: '', gender: '', birthDate: '', avatar: '', generation: '', branch: '' });
      setMessage('Đã tạo người mới');
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi tạo người mới');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRelationship = async () => {
    if (!relationTargetId || !person) {
      setMessage('Vui lòng chọn người để kết nối');
      return;
    }
    if (relationTargetId === person.id) {
      setMessage('Không thể kết nối bản thân với chính mình');
      return;
    }

    try {
      setLoading(true);
      await api.relationship.create({
        fromId: person.id,
        toId: relationTargetId,
        type: relationType,
      });
      setMessage('Đã tạo quan hệ gia đình');
      await refreshApp();
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi tạo quan hệ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRoot = async (value: number) => {
    setRootId(value);
    await loadFamilyTree(value);
  };

  const handleNodeClick = (personId: number, person: Person) => {
    setSelectedNodeId(personId);
    setNodeActionPerson(person);
  };

  const handleCreateChildFromNode = async (childData: {
    fullName: string;
    gender: string;
    birthDate: string;
    avatar: string;
    generation?: number;
    branch?: string;
    parentId: number;
  }) => {
    try {
      setLoading(true);
      const body = {
        fullName: childData.fullName,
        gender: childData.gender,
        birthDate: childData.birthDate,
        avatar: childData.avatar,
        generation: childData.generation,
        branch: childData.branch ? Number(childData.branch) : 1,
      };
      const created = await api.person.create(body);
      setPersons((current) => [...current, created]);

      try {
        const allRels = await api.relationship.list();
        const exists = allRels.some(
          (r) =>
            r.type === 'CHILD' &&
            ((r.fromId === childData.parentId && r.toId === created.id) ||
              (r.fromId === created.id && r.toId === childData.parentId)),
        );
        if (!exists) {
          await api.relationship.create({ fromId: childData.parentId, toId: created.id, type: 'CHILD' });
        }
      } catch {
        await api.relationship.create({ fromId: childData.parentId, toId: created.id, type: 'CHILD' });
      }

      setMessage('Đã tạo con và thiết lập quan hệ');
      setSelectedNodeId(null);
      setNodeActionPerson(null);
      await refreshApp();
    } catch (error) {
      setMessage((error as Error).message || 'Lỗi khi tạo con');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const treeRoot = useMemo(() => treeData?.root ?? null, [treeData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <FamilyTreeHeader
          showApp={showApp}
          user={user}
          allowPublicAccess={ALLOW_PUBLIC_ACCESS}
          loading={loading}
          onLogout={handleLogout}
          onFacebookLogin={handleFacebookLogin}
        />

        {message ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">{message}</div>
        ) : null}

        {showApp ? (
          <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-6">
              <ProfileForm
                profileForm={profileForm}
                onProfileChange={(field, value) => setProfileForm({ ...profileForm, [field]: value })}
                onSaveProfile={handleSaveProfile}
              />
              <NewPersonForm
                newPersonForm={newPersonForm}
                onNewPersonChange={(field, value) => setNewPersonForm({ ...newPersonForm, [field]: value })}
                onCreatePerson={handleCreatePerson}
              />
              <RelationshipForm
                persons={persons}
                currentPersonId={person?.id ?? null}
                relationTargetId={relationTargetId}
                relationType={relationType}
                onRelationTargetChange={setRelationTargetId}
                onRelationTypeChange={setRelationType}
                onCreateRelationship={handleCreateRelationship}
              />
            </div>
            <PersonSidebar persons={persons} rootId={rootId} onRootChange={handleSwitchRoot} />
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg text-slate-700">Bạn cần đăng nhập Facebook để bắt đầu tạo gia phả.</p>
          </section>
        )}

        {treeData ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Cây gia phả</h2>
                <p className="text-sm text-slate-600">Click vào từng node để xem tùy chọn</p>
              </div>
              <div className="text-sm text-slate-500">Gốc: {treeRoot?.fullName ?? 'Không xác định'}</div>
            </div>
            <div className="h-[600px] w-full overflow-hidden rounded-lg border border-slate-200">
              <FamilyTreeGraph
                treeData={treeData}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedNodeId}
              />
            </div>
          </section>
        ) : (
          token && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-600">
              Chọn người làm gốc cây và kiểm tra dữ liệu để hiển thị cây gia phả.
            </section>
          )
        )}

        {nodeActionPerson && (
          <NodeActionModal
            node={nodeActionPerson}
            onClose={() => {
              setSelectedNodeId(null);
              setNodeActionPerson(null);
            }}
            onCreateChild={handleCreateChildFromNode}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
