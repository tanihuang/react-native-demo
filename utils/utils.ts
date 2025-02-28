import moment from 'moment';

export const toRemoveUser = (data: any[], user: any) => {
  if (Array.isArray(user)) {
    const userUuids = new Set(user.map((u: any) => u.uuid));
    return data.filter((item: any) => !userUuids.has(item.uuid));
  } else {
    return data.filter((item: any) => item.uuid !== user.uuid);
  }
};

export const toChatRoomName = (
  members: any[],
  user: { uuid: string },
  chatRoomName: string,
  groupType: number
): string => {
  const otherUserName = members
    .filter((item: any) => item.uuid !== user.uuid)
    .map((item: any) => item.username)
    .join(', ');
  return groupType === 0 ? (otherUserName || chatRoomName) : chatRoomName;
};

export const toChatRoomListDate = (timestamp: any) => {
  if (!timestamp) {
    return null;
  }
  const now = moment();
  const date = moment(timestamp);
  const todayStart = moment().startOf('day');

  if (date.isSame(todayStart, 'day')) {
    return date.format('A h:mm');
  }

  if (date.isSame(now, 'year')) {
    return date.format('MM/DD');
  }

  return date.format('YYYY/MM/DD');
}

export const toChatRoomDate = (timestamp: number) => {
  const itemDate = moment(timestamp);
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");
  const startOfWeek = moment().startOf("week");
  const startOfYear = moment().startOf("year");

  if (itemDate.isSame(today, "day")) return "Today";
  if (itemDate.isSame(yesterday, "day")) return "Yesterday";
  if (itemDate.isAfter(startOfWeek)) return itemDate.format("dddd");
  if (itemDate.isAfter(startOfYear)) return itemDate.format("MM/DD");
  return null;
};
