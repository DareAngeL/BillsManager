import { deleteGroup, saveGroup } from "../../../utils/util";
import useGroupStore from "../../../store/useGroupStore";
import useCustomToast from "../../../hooks/useToast";
import eventBus from "../../../services/EventBus";
import { useEventAction } from "../../../hooks/useEventAction";
import { CarouselHandlerEvent } from "./useCarouselHandler";

export enum GroupHandlerEvent {
  ON_ADD_GROUP = 'add-grp',
  ON_DELETE_GROUP = 'delete-grp',
}

const useGroupHandler = () => {

  const { showNewToast } = useCustomToast();

  const {
    groups,
    activeGroup,
    setActiveGroupIdx,
    setActiveGroup,
    setGroups
  } = useGroupStore();

  useEventAction(CarouselHandlerEvent.ON_SCROLL_END, (index: number) => {
    setActiveGroup(groups[index] || '');
    setActiveGroupIdx(index);
  });

  const handleOnAddGroup = async (groupName: string) => {
    setGroups([...groups, groupName]);

    if (activeGroup === '') {
      setActiveGroup(groupName);
    }

    if (await saveGroup(groupName)) {
      showNewToast('Success', 'Group added successfully', 'success');
      eventBus.emit(GroupHandlerEvent.ON_ADD_GROUP, groupName);
    } else {
      showNewToast('Error', 'Failed to add group', 'err');
      eventBus.emit(GroupHandlerEvent.ON_ADD_GROUP, undefined);
    }
  };

  const handleOnDeleteGroup = async (group: string) => {
    const updatedGroups = groups.filter(grp => grp !== group);
    setGroups(updatedGroups);

    // the actual delete function
    const isDeleted = await deleteGroup(group);
    setActiveGroup(updatedGroups[0] ?? '');

    if (isDeleted) {
      showNewToast('Success', 'Group deleted successfully', 'success');
      eventBus.emit(GroupHandlerEvent.ON_DELETE_GROUP, group);
    } else {
      showNewToast('Error', 'Failed to delete group', 'err');
      eventBus.emit(GroupHandlerEvent.ON_DELETE_GROUP, undefined);
    }
  };

  return {
    handleOnAddGroup,
    handleOnDeleteGroup
  };
};

export default useGroupHandler;