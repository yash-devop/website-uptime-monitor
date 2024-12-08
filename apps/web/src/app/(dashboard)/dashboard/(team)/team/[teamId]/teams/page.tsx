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
import Image from "next/image";

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
type TeamInvitationMemberProps = {
  status: "PENDING" | "ACCEPTED";
  inviteTo: string;
};
// import { User } from "lucide-react";
function TeamMember({ teamName, member, index, plan }: TeamMemberProps) {
  return (
    <>
      <TableRow className="hover:bg-background">
        <TableCell className="font-medium py-3 px-3 bg-reds-400">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-black-5 rounded-lg border-2 border-sidebar-border flex items-center justify-center shrink-0">
              {member.user.image ? (
                <Image
                  width={30}
                  height={30}
                  src={member.user.image}
                  alt="user-logo"
                  className="rounded-md shrink-0 size-full"
                />
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
function TeamInvitationMember({ inviteTo, status }: TeamInvitationMemberProps) {
  return (
    <>
      <TableRow className="hover:bg-background">
        <TableCell className="font-medium py-3 px-3 bg-reds-400">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-black-5 rounded-lg border-2 border-sidebar-border flex items-center justify-center shrink-0">
              <User size={20} className="text-muted-foreground shrink-0"/>
            </div>
            <p className="text-sm truncate">{inviteTo}</p>
            {/* <p className="text-sm text-muted-foreground font-light">
              {invitedBy.email}
            </p> */}
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
            {status}
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
  console.log("teamId: ", teamId);
  const session = await auth();

  // Step 1: Fetch owner user IDs for the team
  const ownerUserIds = await prisma.teamMembership.findMany({
    where: {
      teamId: teamId,
      role: "OWNER",
    },
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  // Extract the owner user IDs into an array
  const ownerEmailList = ownerUserIds.map((owner) => owner.user.email);

  console.log("Owner IDs:", ownerEmailList);

  // Step 2: Fetch the team with filtered invitations
  const teams = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      invitations: {
        where: {
          status: "PENDING",
          NOT: {
            inviteTo: {
              in: ownerEmailList, // Exclude invitations sent to owner emails
            },
          },
        },
        select: {
          inviteTo: true,
          status: true,
        },
      },
    },
  });

  console.log("teams: ", teams);
  console.log("teams with Invitation : ", teams?.invitations);

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
              {teams ? (
                teams.members.map((member, idx) => {
                  return (
                    <TableBody
                      className={`${idx === 0 && "border-t"} border-b border-sidebar-border hover:bg-background`}
                    >
                      <TeamMember
                        teamName={teams.teamName}
                        plan={teams.plan}
                        member={member}
                        index={idx}
                      />
                    </TableBody>
                  );
                })
              ) : (
                <TableCaption>End of the your team.</TableCaption>
              )}
              {/* {teams.map((team, idx) => {
                return (
                  team.members.map((member)=>{
                    return (
                      <TableBody
                        className={`${idx === 0 && "border-t"} border-b border-sidebar-border hover:bg-background`}
                      >
                        <TeamMember  teamName={team.teamName} plan={team.plan} member={member} index={idx}/>
                      </TableBody>
                    )
                  })
                )
              }
            )} */}
              {teams
                ? teams.invitations.map((invitation, idx) => {
                    return (
                      <TableBody
                        className={`${idx === 0 && "border-t"} border-b border-sidebar-border hover:bg-background`}
                      >
                        <TeamInvitationMember
                          inviteTo={invitation.inviteTo}
                          status={invitation.status}
                        />
                      </TableBody>
                    );
                  })
                : ""}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
