import { useGetIssueActivityQuery } from "@/store/api/issues/query";

interface ActivityHistoryProps {
  issueId: string;
  open: boolean;
}

function ActivityHistory({ issueId, open }: ActivityHistoryProps) {
  const { data: activityData, isLoading: isLoadingActivity } =
    useGetIssueActivityQuery(issueId ?? "", {
      skip: !issueId || !open,
    });
  return (
    <section className="border-t pt-4">
      <h3 className="mb-3 font-semibold">Activity history</h3>

      {isLoadingActivity ? (
        <p className="text-sm text-gray-500">Loading activity...</p>
      ) : !activityData?.activity?.length ? (
        <p className="text-sm text-gray-500">No activity recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {activityData.activity.map((entry) => (
            <div key={entry._id} className="rounded-md border p-3">
              <p className="text-sm font-medium">
                {entry.actorId?.name ?? "A user"} updated the issue
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {entry.changes.map((change, index) => (
                  <li key={`${entry._id}-${change.field}-${index}`}>
                    <span className="font-medium">{change.field}</span>:{" "}
                    {String(change.from ?? "None")} →{" "}
                    {String(change.to ?? "None")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ActivityHistory;
