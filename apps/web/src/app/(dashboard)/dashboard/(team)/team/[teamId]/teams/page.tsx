import { Trash, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/app/components/ui/table";
import TeamsModal from "@/app/components/modal/TeamsModal";
import { cookies } from "next/headers";
import { prisma } from "@repo/db";
import { auth } from "@/utils/auth";

type Members = {
  user: {
      image: string | null;
      name: string | null;
      email: string;
  };
} & {
  id: string;
  userId: string;
  teamId: string;
  role: string;
};

type TeamMemberProps = {
  index: number;
  teamName: string;
  plan: string;
  member: Members;
};
// import { User } from "lucide-react";
function TeamMember({ teamName,member,index }: TeamMemberProps) {
  return (
    <>
      <TableRow className="hover:bg-background">
        <TableCell className="font-medium py-3 px-3 bg-reds-400">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-black-5 rounded-lg border-2 border-sidebar-border flex items-center justify-center shrink-0">
              {member.user.image ? (
                <img src={member.user.image} className="rounded-lg shrink-0" />
              ) : (
                <User size={20} className="text-muted-foreground shrink-0" />
              )}
            </div>
            <p className="text-sm truncate">{member.user.name}</p>
            <p className="text-sm text-muted-foreground font-light">
              {member.user.email}
            </p>
            {/* <div className="flex flex-col">
              <p className="text-sm truncate">{member.user.name}</p>
              <p className="text-sm text-muted-foreground font-light">
                {member.user.email}
              </p>
            </div> */}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <p className="font-light text-sm text-muted-foreground truncate">
            {member.role}
          </p>
        </TableCell>
        <TableCell className="text-center">
          <Trash size={19} className="text-destructive" />
        </TableCell>
      </TableRow>
    </>
  );
}

export default async function TeamsPage() {
  const teamId = cookies().get("team-slug")?.value;
  const session = await auth();

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId: session?.user?.id, teamId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex items-center w-full justify-between">
          <span className="text-lg md:text-xl lg:text-2xl">Invite to Team</span>
          <TeamsModal />
        </div>

        <div className="overflow-x-auto w-full">
          <div className="mt-8 w-full">
            <Table>
              {teams.map((team, idx) => {
                return (
                  team.members.map((member)=>{
                    return (
                      <TableBody
                        className={`${idx === 0 && "border-t"} border-b border-sidebar-border hover:bg-background`}
                      >
                        <TeamMember teamName={team.teamName} plan={team.plan} member={member} index={idx} />
                      </TableBody>
                    )
                  })
                )
              }
              )}
              <TableCaption>End of the your team.</TableCaption>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
