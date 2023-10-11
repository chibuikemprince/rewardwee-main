/* import { ObjectId } from "mongoose";
import { TeamMembersModel as MembersModel } from "../databases/external";
import { RESPONSE_TYPE } from "../helpers/customTypes";
import { ErrorDataType, LogError } from "../helpers/errorReporting";
import { MemberInfo } from "./types/index";
import {Teams} from "./teams"

class TeamMemberModule {
  // Add a member to a team
  addMember(teamId: ObjectId, memberInfo: MemberInfo): Promise<RESPONSE_TYPE> {
    return new Promise((resolve, reject) => {
      try {
        // Check if required fields are provided
        if (!memberInfo.firstName ||  !memberInfo.email) {
          const error: RESPONSE_TYPE = {
            data: [],
            message: "First name and email are required",
            status: 400,
            statusCode: "FORM_REQUIREMENT_ERROR"
          };
          reject(error);
          return;
        }

        Teams.getATeam(teamId)
        .then((teamData: any) => {

        MembersModel.create({
          teamId: teamId,
          firstName: memberInfo.firstName,
          lastName: memberInfo.lastName || "",
          email: memberInfo.email,
          role: memberInfo.role || "",
          phoneNumber: memberInfo.phoneNumber || ""
        })
          .then((data: any) => {
            const response: RESPONSE_TYPE = {
              data: [],
              message: "Member added to the team successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
          })
          .catch((err: any) => {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "Failed to add member to the team",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            const err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;
          });


        })
        .catch((err: any) => {
            const error: RESPONSE_TYPE = {
            data: [],
            message: "Failed to add member to the team",
            status: 500,
            statusCode: "UNKNOWN_ERROR"
          };
          reject(error);
          const err_found: ErrorDataType = {
            msg: `${err.message}`,
            status: "STRONG",
            time: new Date().toUTCString(),
            stack: err.stack,
            class: <string><unknown>this
          };
          LogError(err_found);
          return;
        })




      } catch (err: any) {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to add member to the team",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        const err_found: ErrorDataType = {
          msg: `${err.message}`,
          status: "STRONG",
          time: new Date().toUTCString(),
          stack: err.stack,
          class: <string><unknown>this
        };
        LogError(err_found);
        return;
      }
    });
  }

  addMembersInBulk(teamId: ObjectId, members: MemberInfo[]): Promise<RESPONSE_TYPE> {
    return new Promise((resolve, reject) => {
      try {
        if (members.length === 0) {
          const error: RESPONSE_TYPE = {
            data: [],
            message: "No members provided",
            status: 400,
            statusCode: "FORM_REQUIREMENT_ERROR"
          };
          reject(error);
          return;
        }

        if (members.length > 100) {
          const error: RESPONSE_TYPE = {
            data: [],
            message: "Maximum of 100 members allowed at a time",
            status: 400,
            statusCode: "FORM_REQUIREMENT_ERROR"
          };
          reject(error);
          return;
        }

        const memberDocuments = members.map((member) => ({
          teamId: teamId,
          firstName: member.firstName,
          lastName: member.lastName || "",
          email: member.email,
          role: member.role || "",
          phoneNumber: member.phoneNumber || ""
        }));

        MembersModel.insertMany(memberDocuments)
          .then(() => {
            const response: RESPONSE_TYPE = {
              data: [],
              message: "Members added to the team successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
          })
          .catch((err: any) => {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "Failed to add members to the team",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            const err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string> <unknown>this
            };
            LogError(err_found);
            return;
          });
      } catch (err: any) {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to add members to the team",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        const err_found: ErrorDataType = {
          msg: `${err.message}`,
          status: "STRONG",
          time: new Date().toUTCString(),
          stack: err.stack,
          class: <string> <unknown>this
        };
        LogError(err_found);
        return;
      }
    });
  }


  // Edit a team member's information
  editMember(memberId: ObjectId, updatedInfo: MemberInfo): Promise<RESPONSE_TYPE> {
    return new Promise((resolve, reject) => {
      try {
        // Check if required fields are provided
        if (Object.keys(updatedInfo).length === 0) {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "No updated information provided",
              status: 400,
              statusCode: "FORM_REQUIREMENT_ERROR"
            };
            reject(error);
            return;
          }

        MembersModel.updateOne({ _id: memberId }, updatedInfo)
          .then((data: any) => {
            const response: RESPONSE_TYPE = {
              data: [],
              message: "Member information updated successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
          })
          .catch((err: any) => {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "Failed to update member information",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            const err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;
          });



          
      } catch (err: any) {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to update member information",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        const err_found: ErrorDataType = {
          msg: `${err.message}`,
          status: "STRONG",
          time: new Date().toUTCString(),
          stack: err.stack,
          class: <string><unknown>this
        };
        LogError(err_found);
        return;
      }
    });
  }

  // Fetch members of a team
  fetchMembersByTeam(teamId: ObjectId): Promise<RESPONSE_TYPE> {
    return new Promise((resolve, reject) => {
      try {
        MembersModel.find({ teamId })
          .then((data: any) => {
            const response: RESPONSE_TYPE = {
              data,
              message: "Team members fetched successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
          })
          .catch((err: any) => {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "Failed to fetch team members",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            const err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;
          });
      } catch (err: any) {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to fetch team members",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        const err_found: ErrorDataType = {
          msg: `${err.message}`,
          status: "STRONG",
          time: new Date().toUTCString(),
          stack: err.stack,
          class: <string><unknown>this
        };
        LogError(err_found);
        return;
      }
    });
  }

  // Remove a team member
  removeMember(memberId: ObjectId): Promise<RESPONSE_TYPE> {
    return new Promise((resolve, reject) => {
      try {
        MembersModel.deleteOne({ _id: memberId })
          .then((data: any) => {
            const response: RESPONSE_TYPE = {
              data,
              message: "Member removed from the team successfully",
              status: 200,
              statusCode: "SUCCESS"
            };
            resolve(response);
            return;
          })
          .catch((err: any) => {
            const error: RESPONSE_TYPE = {
              data: [],
              message: "Failed to remove member from the team",
              status: 500,
              statusCode: "UNKNOWN_ERROR"
            };
            reject(error);
            const err_found: ErrorDataType = {
              msg: `${err.message}`,
              status: "STRONG",
              time: new Date().toUTCString(),
              stack: err.stack,
              class: <string><unknown>this
            };
            LogError(err_found);
            return;
          });
      } catch (err: any) {
        const error: RESPONSE_TYPE = {
          data: [],
          message: "Failed to remove member from the team",
          status: 500,
          statusCode: "UNKNOWN_ERROR"
        };
        reject(error);
        const err_found: ErrorDataType = {
          msg: `${err.message}`,
          status: "STRONG",
          time: new Date().toUTCString(),
          stack: err.stack,
          class: <string><unknown>this
        };
        LogError(err_found);
        return;
      }
    });
  }
}

export const TeamMember = new TeamMemberModule(); */