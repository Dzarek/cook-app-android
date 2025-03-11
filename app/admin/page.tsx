import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import AdminComponent from "@/components/AdminComponent";
import { getAllUsers } from "@/lib/actions";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  const allowedUID = process.env.NEXT_PUBLIC_ADMIN_ID;

  const users = await getAllUsers();

  if (!session) {
    return (
      <div className="page flex flex-col items-center justify-center">
        <p className="text-2xl">Odmowa dostępu!</p>
        <Link
          href="/logowanie"
          className="mt-5 p-2 rounded-md bg-red-900 text-white"
        >
          {" "}
          zaloguj się
        </Link>
      </div>
    );
  }
  if (session.uid !== allowedUID) {
    return (
      <div className="page flex flex-col items-center justify-center">
        <p className="text-2xl">
          Nie masz uprawnień aby zobaczyć panel admina.
        </p>
      </div>
    );
  }

  return (
    <div className="page w-screen">
      <header className="bg-red-950 text-white text-center w-full py-[10vh] flex justify-center items-center">
        <h1 className="text-xl xl:text-3xl font-bold font-bodyFont">
          Panel Admina
        </h1>
      </header>
      {users && <AdminComponent users={users} />}
    </div>
  );
};

export default AdminPage;
