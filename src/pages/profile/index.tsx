// pages/profile.tsx
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function Profile() {
    const { data: status } = useSession();
    const session = useSession();

    // if (status === "loading") {
    //     return <p>Loading...</p>;
    // }

    if (!session) {
        return <p>You are not signed in.</p>;
    }

    useEffect(() => {
        console.log(session);
    }, [session]);

    return (
        <div>
            <h1>Profile</h1>
            {/* <p>Signed in as {session?.user?.email}</p>
            <img src={session?.user?.image} alt={session?.user?.name} />
            <button onClick={() => signOut()}>Sign out</button> */}
        </div>
    );
}
