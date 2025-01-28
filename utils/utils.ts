import moment from 'moment';

export const toRemoveUser = (data: any[], user: any) => {
  if (Array.isArray(user)) {
    const userUuids = new Set(user.map((u: any) => u.uuid));
    return data.filter((item: any) => !userUuids.has(item.uuid));
  } else {
    return data.filter((item: any) => item.uuid !== user.uuid);
  }
};

export const toChatRoomScreenDate = (data: any[]) => {
  return data.reduce((result: { title: string; data: any[] }[], item: any) => {
    const itemDate = moment(item.timestamp);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");
    const startOfWeek = moment().startOf("week");

    let title;

    switch (true) {
      case itemDate.isSame(today, "day"):
        title = "Today";
        break;
      case itemDate.isSame(yesterday, "day"):
        title = "Yesterday";
        break;
      case itemDate.isAfter(startOfWeek):
        title = itemDate.format("dddd");
        break;
      default:
        title = itemDate.format("MMMM D, YYYY");
    }

    let section = result.find((s) => s.title === title);
    if (!section) {
      section = { title, data: [] };
      result.push(section);
    }
    section.data.push(item);

    return result;
  }, []);
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

export const toChatRoomListDate = (timestamp: number): string => {
  const now = moment(); // 當前時間
  const date = moment(timestamp); // 傳入的時間戳
  const todayStart = moment().startOf('day'); // 今日開始的時間戳

  // 1. 如果是今天
  if (date.isSame(todayStart, 'day')) {
    return date.format('A h:mm'); // 例如：下午11:59
  }

  // 2. 如果是今年（但不是今天）
  if (date.isSame(now, 'year')) {
    return date.format('MM/DD'); // 例如：01/19
  }

  // 3. 如果是過去年份
  return date.format('YYYY/MM/DD'); // 例如：2024/01/19
}