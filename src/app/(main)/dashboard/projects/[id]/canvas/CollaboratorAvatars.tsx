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
    <div className="absolute top-2 right-2 flex -space-x-2 overflow-hidden pointer-events-none z-50 p-2">
      {activeUsers.map((u) => {
        const userInfo = u.info as { name: string; avatar: string; color: string };
        return (
          <div key={u.connectionId} className="relative group">
            <Avatar className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-white">
              <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
              <AvatarFallback style={{ backgroundColor: userInfo.color || '#ccc' }}>
                {userInfo.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
             {/* Tooltip for name */}
             <div className="absolute top-full right-0 mt-1 hidden group-hover:flex bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {userInfo.name}
             </div>
          </div>
        );
      })}
    </div>
  );
}
