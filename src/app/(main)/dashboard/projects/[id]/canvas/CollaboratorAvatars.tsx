"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CollaboratorAvatars() {
  const users = useOthers();
  const currentUser = useSelf();

  // Combine others and current user if available
  const allUsers = [
    ...(currentUser ? [currentUser] : []),
    ...users,
  ];

  // Filter those who have valid user info
  const activeUsers = allUsers.filter((u) => u.info);

  return (
    <div className="absolute top-2 scale-75 left-1/2 flex -space-x-2 overflow-hidden pointer-events-none z-50 ">
      {activeUsers.map((u) => {
        const userInfo = u.info as { name: string; avatar: string; color: string };
        return (
          <div key={u.connectionId} className="relative group bg-accent min-w-[200px] px-3 py-1 rounded-full">
            <p className="text-xs text-muted-foreground text-center ">Active on Board </p>
            <Avatar className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-white">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback style={{ backgroundColor: userInfo.color || '#ccc' }}>
                {userInfo.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      })}
    </div>
  );
}
