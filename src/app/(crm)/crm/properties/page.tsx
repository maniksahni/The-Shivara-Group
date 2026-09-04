import { getProperties } from "@/features/properties/actions";
import PropertiesManagerClient from "@/components/crm/properties/PropertiesManagerClient";
import type { PropertyRecord } from "@/types";

export type { PropertyRecord };

export default async function PropertiesPage() {
  const result = await getProperties();
  const properties: PropertyRecord[] = result.success && result.data ? result.data : [];

  return <PropertiesManagerClient initialProperties={properties} />;
}
