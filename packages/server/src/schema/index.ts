import { Company as _Company } from './company'
import { CompanyRelations as _CompanyRelations } from './company_relations'
import { DailyCompanyRecord as _DailyCompanyRecord } from './daily_company_record'
import { DailyCompanyRecordRelations as _DailyCompanyRecordRelations } from './daily_company_record_relations'
import { DailyWorkplaceRecord as _DailyWorkplaceRecord } from './daily_workplace_record'
import { DailyWorkplaceRecordRelations as _DailyWorkplaceRecordRelations } from './daily_workplace_record_relations'
import { GitCommit as _GitCommit } from './git_commit'
import { GitCommitRelations as _GitCommitRelations } from './git_commit_relations'
import { GitProject as _GitProject } from './git_project'
import { GitProjectRelations as _GitProjectRelations } from './git_project_relations'
import { GitRepo as _GitRepo } from './git_repo'
import { GitRepoRelations as _GitRepoRelations } from './git_repo_relations'
import { GitReport as _GitReport } from './git_report'
import { GitReportRelations as _GitReportRelations } from './git_report_relations'
import { GitStaff as _GitStaff } from './git_staff'
import { GitStaffRelations as _GitStaffRelations } from './git_staff_relations'
import { MessageRobot as _MessageRobot } from './message_robot'
import { MessageRobotRelations as _MessageRobotRelations } from './message_robot_relations'
import { OffworkNoticeMailSubscription as _OffworkNoticeMailSubscription } from './offwork_notice_mail_subscription'
import { OffworkNoticeMailSubscriptionRelations as _OffworkNoticeMailSubscriptionRelations } from './offwork_notice_mail_subscription_relations'
import { OffworkNoticeSetting as _OffworkNoticeSetting } from './offwork_notice_setting'
import { OffworkNoticeSettingRelations as _OffworkNoticeSettingRelations } from './offwork_notice_setting_relations'
import { OffworkViewRecord as _OffworkViewRecord } from './offwork_view_record'
import { OffworkViewRecordRelations as _OffworkViewRecordRelations } from './offwork_view_record_relations'
import { Shorts as _Shorts } from './shorts'
import { ShortsRelations as _ShortsRelations } from './shorts_relations'
import { User as _User } from './user'
import { UserRelations as _UserRelations } from './user_relations'
import { WorkdayRecord as _WorkdayRecord } from './workday_record'
import { WorkdayRecordRelations as _WorkdayRecordRelations } from './workday_record_relations'
import { Workplace as _Workplace } from './workplace'
import { WorkplaceRelations as _WorkplaceRelations } from './workplace_relations'

export namespace PrismaModel {
  export class UserRelations extends _UserRelations {}
  export class CompanyRelations extends _CompanyRelations {}
  export class WorkplaceRelations extends _WorkplaceRelations {}
  export class MessageRobotRelations extends _MessageRobotRelations {}
  export class WorkdayRecordRelations extends _WorkdayRecordRelations {}
  export class DailyCompanyRecordRelations extends _DailyCompanyRecordRelations {}
  export class DailyWorkplaceRecordRelations extends _DailyWorkplaceRecordRelations {}
  export class OffworkViewRecordRelations extends _OffworkViewRecordRelations {}
  export class OffworkNoticeSettingRelations extends _OffworkNoticeSettingRelations {}
  export class OffworkNoticeMailSubscriptionRelations extends _OffworkNoticeMailSubscriptionRelations {}
  export class GitProjectRelations extends _GitProjectRelations {}
  export class GitRepoRelations extends _GitRepoRelations {}
  export class GitStaffRelations extends _GitStaffRelations {}
  export class GitCommitRelations extends _GitCommitRelations {}
  export class GitReportRelations extends _GitReportRelations {}
  export class ShortsRelations extends _ShortsRelations {}
  export class User extends _User {}
  export class Company extends _Company {}
  export class Workplace extends _Workplace {}
  export class MessageRobot extends _MessageRobot {}
  export class WorkdayRecord extends _WorkdayRecord {}
  export class DailyCompanyRecord extends _DailyCompanyRecord {}
  export class DailyWorkplaceRecord extends _DailyWorkplaceRecord {}
  export class OffworkViewRecord extends _OffworkViewRecord {}
  export class OffworkNoticeSetting extends _OffworkNoticeSetting {}
  export class OffworkNoticeMailSubscription extends _OffworkNoticeMailSubscription {}
  export class GitProject extends _GitProject {}
  export class GitRepo extends _GitRepo {}
  export class GitStaff extends _GitStaff {}
  export class GitCommit extends _GitCommit {}
  export class GitReport extends _GitReport {}
  export class Shorts extends _Shorts {}

  export const extraModels = [
    UserRelations,
    CompanyRelations,
    WorkplaceRelations,
    MessageRobotRelations,
    WorkdayRecordRelations,
    DailyCompanyRecordRelations,
    DailyWorkplaceRecordRelations,
    OffworkViewRecordRelations,
    OffworkNoticeSettingRelations,
    OffworkNoticeMailSubscriptionRelations,
    GitProjectRelations,
    GitRepoRelations,
    GitStaffRelations,
    GitCommitRelations,
    GitReportRelations,
    ShortsRelations,
    User,
    Company,
    Workplace,
    MessageRobot,
    WorkdayRecord,
    DailyCompanyRecord,
    DailyWorkplaceRecord,
    OffworkViewRecord,
    OffworkNoticeSetting,
    OffworkNoticeMailSubscription,
    GitProject,
    GitRepo,
    GitStaff,
    GitCommit,
    GitReport,
    Shorts,
  ]
}
