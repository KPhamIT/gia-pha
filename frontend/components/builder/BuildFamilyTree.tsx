'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
  useDragDropMonitor,
} from '@dnd-kit/react';
import { Person, RelationshipType } from '../types/family-tree-types';
import { getRootPerson } from '@/utils/family-tree-utils';
import PersonActionModal from './PersonActionModal';
import { api } from '@/lib/api';

type RelatedPerson = Person & { relationshipId: number };

type RelationshipEntry = {
  id: number;
  type: RelationshipType;
  fromId: number;
  toId: number;
  from: Person;
  to: Person;
};

type PersonTreeResponse = {
  relationships: RelationshipEntry[];
};

type DropZoneId = 'ancestorFather' | 'father' | 'mother' | 'children';

function DroppableZone({ id, children }: { id: DropZoneId; children: ReactNode }) {
  const { isDropTarget, ref } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={`min-h-24 rounded-lg border-2 border-dashed p-4 transition-colors ${
        isDropTarget ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function DraggablePersonCard({ person, onActivate, onClick, onActionClick }: { person: Person; onActivate: () => void; onClick?: () => void; onActionClick?: () => void }) {
  const { ref, isDragging } = useDraggable({
    id: person.id.toString(),
  });

  const handlePointerUp = () => {
    if (!isDragging && onClick) onClick();
  };

  return (
    <div
      ref={ref}
      onPointerDown={onActivate}
      onPointerUp={handlePointerUp}
      className={`relative cursor-grab rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {onActionClick ? (
        <button
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); onActionClick(); }}
          className="absolute right-2 top-2 z-10 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
        >
          ⋯
        </button>
      ) : null}

      <p className="font-semibold text-slate-900">{person.fullName}</p>
      <p className="text-xs text-slate-500">{person.gender}</p>
      {person.branch ? (
        <p className="text-xs text-slate-500">Nhánh {person.branch === 1 ? 'Đại Tôn' : person.branch === 2 ? 'Trung Tôn' : 'Tiểu Tôn'}</p>
      ) : null}
    </div>
  );
}

export default function BuildFamilyTree() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [activePerson, setActivePerson] = useState<Person | null>(null);

  const [ancestorFather, setAncestorFather] = useState<RelatedPerson | null>(null);
  const [father, setFather] = useState<RelatedPerson | null>(null);
  const [mother, setMother] = useState<RelatedPerson | null>(null);
  const [children, setChildren] = useState<RelatedPerson[]>([]);
  const [hoveredZone, setHoveredZone] = useState<DropZoneId | null>(null);
  const [actionPerson, setActionPerson] = useState<Person | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [branchFilter, setBranchFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const groupedPersons = useMemo(() => {
    const groups = new Map<number | null, Person[]>();

    const filteredPersons = persons.filter((person) => {
      return branchFilter === 'all' || person.branch === Number(branchFilter);
    });

    filteredPersons.forEach((person) => {
      const generation = person.generation ?? null;
      const members = groups.get(generation) ?? [];
      members.push(person);
      groups.set(generation, members);
    });

    return Array.from(groups.entries())
      .map(([generation, members]) => ({
        generation,
        label: generation !== null ? `Đời thứ ${generation}` : 'Đời chưa rõ',
        members: members.sort((a, b) => a.fullName.localeCompare(b.fullName)),
      }))
      .sort((a, b) => {
        if (a.generation === null) return 1;
        if (b.generation === null) return -1;
        return a.generation - b.generation;
      });
  }, [persons, branchFilter]);

  async function fetchPersons() {
    try {
      setLoading(true);
      const data = await api.person.list();
      setPersons(data);
      const initialPerson = getRootPerson(data);
      if (initialPerson) {
        setSelectedPerson(initialPerson);
        await fetchRelationships(initialPerson.id);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPersons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchRelationships(personId: number) {
    try {
      const treeData = await api.person.getTree(personId) as PersonTreeResponse;

      const directFatherRel = treeData.relationships.find(
        (r) => r.toId === personId && r.type === 'FATHER'
      );
      const directMotherRel = treeData.relationships.find(
        (r) => r.toId === personId && r.type === 'MOTHER'
      );
      const father = directFatherRel
        ? { ...directFatherRel.from, relationshipId: directFatherRel.id }
        : null;
      const mother = directMotherRel
        ? { ...directMotherRel.from, relationshipId: directMotherRel.id }
        : null;

      const childRelationships = treeData.relationships.filter(
        (r) =>
          r.fromId === personId &&
          r.type === 'CHILD' &&
          r.toId !== father?.id &&
          r.toId !== mother?.id
      );
      const ancestorFatherRel = father
        ? treeData.relationships.find(
            (r) => r.toId === father.id && r.type === 'FATHER'
          )
        : null;

      setAncestorFather(
        ancestorFatherRel ? { ...ancestorFatherRel.from, relationshipId: ancestorFatherRel.id } : null,
      );
      setFather(father);
      setMother(mother);
      setChildren(childRelationships.map((r) => ({ ...r.to, relationshipId: r.id })) || []);
    } catch (err) {
      console.error('Error fetching relationships:', err);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setAncestorFather(null);
    setFather(null);
    setMother(null);
    setChildren([]);
    fetchRelationships(person.id);
  };

  const openActionModal = (person: Person) => {
    setActionPerson(person);
  };

  const toggleSelected = (person: Person) => {
    setSelectedIds((prev) => {
      if (prev.includes(person.id)) {
        return prev.filter((id) => id !== person.id);
      }
      return [...prev, person.id];
    });
  };

  const closeActionModal = () => {
    setActionPerson(null);
  };

  const handlePersonAction = async (action: 'ANCESTOR_FATHER' | RelationshipType) => {
    if (!actionPerson) return;

    const targets = persons.filter((p) => selectedIds.includes(p.id));

    if (targets.length === 0) {
      setMessage('Vui lòng chọn ít nhất một người ở danh sách bên trái');
      return;
    }

    try {
      setLoading(true);

      if (action === 'ANCESTOR_FATHER') {
        if (targets.length !== 1) {
          setMessage('Hành động ông chỉ hỗ trợ cho một người tại một thời điểm');
        } else {
          const target = targets[0];
          const treeData = await api.person.getTree(target.id) as PersonTreeResponse;
          const directFatherRel = treeData.relationships.find((r) => r.toId === target.id && r.type === 'FATHER');
          if (!directFatherRel) {
            setMessage('Vui lòng thêm bố trước khi thêm ông cho người này');
          } else {
            await api.relationship.create({ fromId: actionPerson.id, toId: directFatherRel.from.id, type: 'FATHER' });
            setMessage('Đã thêm ông thành công');
          }
        }
      } else {
        console.log("handlePersonAction===================>", { action, actionPerson, targets });

        for (const target of targets) {
          let fromId = actionPerson.id;
          let toId = target.id;

          if (action === 'CHILD') {
            fromId = target.id;
            toId = actionPerson.id;
          }

          try {
            await api.relationship.create({ fromId, toId, type: action });
          } catch (err) {
            console.error('create relationship failed', err);
          }
        }

        setMessage('Hoàn thành thao tác với người được chọn');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
      closeActionModal();
      if (selectedPerson) await fetchRelationships(selectedPerson.id);
    }
  };

  const handleDragEnd = async (event: any) => {
    if (event.canceled) {
      setActivePerson(null);
      setHoveredZone(null);
      return;
    }

    const target = event.operation?.target;
    const zone = (target?.id as DropZoneId | undefined) ?? hoveredZone;

    if (!activePerson || !selectedPerson || !zone) {
      if (!activePerson) console.warn('Drag ended with no activePerson');
      if (!selectedPerson) console.warn('Drag ended with no selectedPerson');
      if (!zone) console.warn('Drag ended with no drop zone');
      setActivePerson(null);
      setHoveredZone(null);
      return;
    }
    console.debug('resolved drop zone', zone);

    if (zone === 'ancestorFather') {
      await handleAncestorDrop(activePerson);
    } else if (zone === 'father' || zone === 'mother' || zone === 'children') {
      const relationshipType =
        zone === 'children'
          ? 'CHILD'
          : (zone.toUpperCase() as RelationshipType);
      console.debug('handleDrop calling', { relationshipType });

      await handleDrop(activePerson, relationshipType);
    } else {
      console.warn('Unknown drop zone', zone);
    }

    setActivePerson(null);
  };

  const handleDrop = async (draggedPerson: Person, dropZone: RelationshipType) => {
    if (!selectedPerson) return;

    const fromId = draggedPerson.id;
    const toId = selectedPerson.id;

    if (fromId === toId) {
      setMessage('Không thể kết nối bản thân với chính mình');
      return;
    }

    try {
      setLoading(true);

      let finalFromId = fromId;
      let finalToId = toId;

      if (dropZone === 'CHILD') {
        finalFromId = toId;
        finalToId = fromId;
      }

      const payload = { fromId: finalFromId, toId: finalToId, type: dropZone };
      console.debug('handleDrop payload', payload);

      await api.relationship.create(payload);

      setMessage('Đã tạo quan hệ thành công');
      await fetchRelationships(selectedPerson.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const handleAncestorDrop = async (draggedPerson: Person) => {
    if (!selectedPerson || !father) {
      setMessage('Vui lòng thêm bố trước khi thêm ông');
      return;
    }

    if (draggedPerson.id === father.id) {
      setMessage('Không thể kết nối bản thân với chính mình');
      return;
    }

    try {
      setLoading(true);

      const payload = { fromId: draggedPerson.id, toId: father.id, type: 'FATHER' as RelationshipType };
      console.debug('handleAncestorDrop payload', payload);

      await api.relationship.create(payload);

      setMessage('Đã tạo quan hệ ông thành công');
      await fetchRelationships(selectedPerson.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useDragDropMonitor({
    onDragStart: () => setHoveredZone(null),
    onDragOver: (event) => {
      const targetId = event.operation?.target?.id as DropZoneId | undefined;
      setHoveredZone(targetId ?? null);
    },
    onDragEnd: () => setHoveredZone(null),
  });

  const handleClearZone = async (
    zone: 'ancestorFather' | 'father' | 'mother' | 'children',
    childId?: number,
  ) => {
    if (!selectedPerson) return;

    let relationshipId: number | null = null;

    if (zone === 'ancestorFather' && ancestorFather) {
      relationshipId = ancestorFather.relationshipId;
    }

    if (zone === 'father' && father) {
      relationshipId = father.relationshipId;
    }

    if (zone === 'mother' && mother) {
      relationshipId = mother.relationshipId;
    }

    if (zone === 'children' && childId) {
      const child = children.find((c) => c.relationshipId === childId);
      if (child) {
        relationshipId = child.relationshipId;
      }
    }

    if (!relationshipId) return;

    try {
      setLoading(true);
      await api.relationship.delete(relationshipId);
      setMessage('Đã xóa quan hệ thành công');
      await fetchRelationships(selectedPerson.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Lỗi khi xóa quan hệ');
    } finally {
      setLoading(false);
    }
  };

  if (loading && persons.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Xây dựng cây gia phả</h1>

        {message && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-slate-800">
            {message}
          </div>
        )}

        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="grid gap-6 lg:grid-cols-[250px,repeat(4,minmax(0,1fr))]">
          {/* Sidebar: Danh sách người */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-slate-900">Danh sách thành viên</h2>
              <label className="block text-sm text-slate-700">
                Nhánh hiển thị
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500"
                  value={branchFilter}
                  onChange={(event) => setBranchFilter(event.target.value as 'all' | '1' | '2' | '3')}
                >
                  <option value="all">Tất cả nhánh</option>
                  <option value="1">Đại Tôn</option>
                  <option value="2">Trung Tôn</option>
                  <option value="3">Tiểu Tôn</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {groupedPersons.map((group) => (
                <div key={group.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                  <div className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {group.label}
                  </div>
                  <div className="space-y-2">
                    {group.members.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => toggleSelected(person)}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          selectedIds.includes(person.id)
                            ? 'border-blue-500 bg-blue-50 font-semibold text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">{person.fullName}</div>
                        <div className="text-xs text-slate-500">
                          {person.gender}
                          {person.branch ? ` • Nhánh ${person.branch === 1 ? 'Đại Tôn' : person.branch === 2 ? 'Trung Tôn' : 'Tiểu Tôn'}` : ''}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected person info */}
          {selectedPerson && (
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <h2 className="text-2xl font-bold text-blue-900">{selectedPerson.fullName}</h2>
                <p className="mt-2 text-sm text-blue-700">
                  {selectedPerson.gender} • {selectedPerson.birthDate}
                </p>
                {selectedPerson.branch ? (
                  <p className="mt-1 text-sm text-blue-700">Nhánh {selectedPerson.branch === 1 ? 'Đại Tôn' : selectedPerson.branch === 2 ? 'Trung Tôn' : 'Tiểu Tôn'}</p>
                ) : null}
              </div>

              <div className="grid gap-6 lg:grid-cols-4">
                {/* Ancestor Father */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-slate-900">Ông (Ông cố)</h3>
                  <DroppableZone id="ancestorFather">
                    {ancestorFather ? (
                      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                        <div>
                          <p className="font-semibold text-slate-900">{ancestorFather.fullName}</p>
                          <p className="text-xs text-slate-500">{ancestorFather.gender}</p>
                        </div>
                        <button
                          onClick={() => handleClearZone('ancestorFather')}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : father ? (
                      <p className="text-center text-slate-500">Kéo người vào đây</p>
                    ) : (
                      <p className="text-center text-slate-500">Thêm bố trước để thêm ông</p>
                    )}
                  </DroppableZone>
                </div>

                {/* Father */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-slate-900">Bố</h3>
                  <DroppableZone id="father">
                    {father ? (
                      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                        <div>
                          <p className="font-semibold text-slate-900">{father.fullName}</p>
                          <p className="text-xs text-slate-500">{father.gender}</p>
                        </div>
                        <button
                          onClick={() => handleClearZone('father')}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-center text-slate-500">Kéo người vào đây</p>
                    )}
                  </DroppableZone>
                </div>

                {/* Mother */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-slate-900">Mẹ</h3>
                  <DroppableZone id="mother">
                    {mother ? (
                      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                        <div>
                          <p className="font-semibold text-slate-900">{mother.fullName}</p>
                          <p className="text-xs text-slate-500">{mother.gender}</p>
                        </div>
                        <button
                          onClick={() => handleClearZone('mother')}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-center text-slate-500">Kéo người vào đây</p>
                    )}
                  </DroppableZone>
                </div>

                {/* Children */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-slate-900">Con</h3>
                  <DroppableZone id="children">
                    {children.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {children.map((child) => (
                          <div key={child.id} className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
                            <div>
                              <p className="font-semibold text-slate-900">{child.fullName}</p>
                              <p className="text-xs text-slate-500">{child.gender}</p>
                            </div>
                            <button
                              onClick={() => handleClearZone('children', child.relationshipId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500">Kéo người vào đây</p>
                    )}
                  </DroppableZone>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Draggable persons list for drag source */}
        {selectedPerson && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Kéo thành viên vào các ô ở trên</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {persons
                .filter((p) => {
                  if (branchFilter !== 'all' && p.branch !== Number(branchFilter)) return false;
                  if (p.id === selectedPerson.id) return false;
                  if (father?.id === p.id) return false;
                  if (mother?.id === p.id) return false;
                  if (ancestorFather?.id === p.id) return false;
                  return !children.some((child) => child.id === p.id);
                })
                .map((person) => (
                  <DraggablePersonCard
                    key={person.id}
                    person={person}
                    onActivate={() => setActivePerson(person)}
                    onClick={() => openActionModal(person)}
                    onActionClick={() => openActionModal(person)}
                  />
                ))}
            </div>
          </div>
        )}

        {actionPerson ? (
          <PersonActionModal
            actionPerson={actionPerson}
            selectedTargets={persons.filter((p) => selectedIds.includes(p.id))}
            onClose={closeActionModal}
            onAction={handlePersonAction}
          />
        ) : null}

            <DragOverlay>
              {activePerson ? (
                <div
                  style={{ pointerEvents: 'none', touchAction: 'none', zIndex: 9999 }}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-md"
                >
                  {activePerson.fullName}
                </div>
              ) : null}
            </DragOverlay>
          </DragDropProvider>
      </div>
    </div>
  );
}
