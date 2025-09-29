import { deleteGroup, saveGroup } from "../../../utils/util";
import useGroupStore from "../../../store/useGroupStore";
import useCustomToast from "../../../hooks/useToast";
import useBillStore from "../../../store/useBillStore";

const useGroupHandler = () => {

  const { showNewToast } = useCustomToast();

  const { updateOptimisticBills } = useBillStore();

  const {
    groups,
    activeGroup,
    setActiveGroup,
    setGroups
  } = useGroupStore();

  const handleOnAddGroup = async (groupName: string) => {
    setGroups([...groups, groupName]);

    if (activeGroup === '') {
      setActiveGroup(groupName);
    }

    if (await saveGroup(groupName)) {
      updateOptimisticBills({
        type: 'add-group',
        data: { name: groupName },
      }, activeGroup);
      showNewToast('Success', 'Group added successfully', 'success');
    } else {
      showNewToast('Error', 'Failed to add group', 'err');
    }
  };

  const handleOnDeleteGroup = async (group: string) => {
    const updatedGroups = groups.filter(grp => grp !== group);
    setGroups(updatedGroups);

    // the actual delete function
    const isDeleted = await deleteGroup(group);
    setActiveGroup(updatedGroups[0] ?? '');

    if (isDeleted) {
      updateOptimisticBills({
        type: 'delete-group',
        data: { name: group },
      }, activeGroup);
      showNewToast('Success', 'Group deleted successfully', 'success');
    } else {
      showNewToast('Error', 'Failed to delete group', 'err');
    }
  };

  return {
    handleOnAddGroup,
    handleOnDeleteGroup
  };
};

export default useGroupHandler;