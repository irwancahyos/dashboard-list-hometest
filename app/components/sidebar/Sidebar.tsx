import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname();
  const isEditpage = Boolean(path.startsWith('/inventory') && path.endsWith('/edit'));

  const titleMap: Record<string, string> = {
    '/inventory': "Dashboard",
    '/inventory/create': "Tambah Barang",
  } 

  return (
    <div>
      <ul>
        <li className="p-4 rounded-[0.75rem] bg-(--secondary-color) shadow-xl text-(--text-primary-color)">
          {isEditpage ? "Edit Barang" : titleMap[path]}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;