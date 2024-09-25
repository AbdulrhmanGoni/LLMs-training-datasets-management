import ServiceOperationResult from "../../utilities/ServiceOperationResult";
import RecentActivitiesModel from "../../models/RecentActivitiesModel";
import type { Activity, ActivityResource } from "../../types/activities";
import type { ServiceOperationResultType } from "../../types/response";

export default async function registerActivity_service(
  resourceName: ActivityResource,
  activity: Activity,
  userId: string
): Promise<ServiceOperationResultType> {
  const updateQuery = {
    $push: {
      [`recentActivitiesOf${resourceName}`]: {
        $each: [activity],
        $position: 0,
        $slice: 5,
      },
    },
  };

  const result = await RecentActivitiesModel.updateOne(
    { _id: userId },
    updateQuery,
    { upsert: true }
  );

  if (result.modifiedCount) {
    return ServiceOperationResult.success(true);
  }

  return ServiceOperationResult.failure("Activity registration failed", false);
}
