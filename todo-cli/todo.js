/* eslint-disable*/
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    return all.filter((item) => {
      return item.dueDate < new Date().toISOString().slice(0, 10);
    });
  };

  const dueToday = () => {
    return all.filter((item) => {
      return item.dueDate === new Date().toISOString().slice(0, 10);
    });
  };

  const dueLater = () => {
    return all.filter((item) => {
      return item.dueDate > new Date().toISOString().slice(0, 10);
    });
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    const dateToday = new Date();
    const today = formattedDate(dateToday);
    const displayableList = list.map((item, index) => {
      if (item.dueDate === today) {
        let status = item.completed ? "x" : " ";
        return `[${status}] ${item.title}`;
      } else {
        let status = item.completed ? "x" : " ";
        return `[${status}] ${item.title} ${item.dueDate}`;
      }
    });
    return displayableList.join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
