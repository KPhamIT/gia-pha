import { api } from "@/lib/api";
import type { Person } from "@/components/types/family-tree-types";
import { getRootPerson } from "@/utils/family-tree-utils";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

export async function resolveRootPersonId(
  allowPublicAccess: boolean,
): Promise<number | null> {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (token) {
    try {
      const meResponse = await api.auth.me();
      if (meResponse?.person?.id) {
        return meResponse.person.id;
      }
      if (meResponse?.user) {
        const tree = await api.person.getDefaultTree();
        return (
          tree.root?.id ?? getRootPerson(tree.persons as Person[])?.id ?? null
        );
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  if (!allowPublicAccess) {
    return null;
  }

  try {
    const tree = await api.person.getDefaultTree();
    return tree.root?.id ?? getRootPerson(tree.persons as Person[])?.id ?? null;
  } catch (err) {
    console.error("Error fetching default tree:", err);
    return null;
  }
}
