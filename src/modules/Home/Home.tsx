/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList, StatusBar} from 'react-native';
import {Box} from '../../components/ui/box';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heading} from '../../components/ui/heading';
import clsx from 'clsx';
import {Text} from '../../components/ui/text';
import {HStack} from '../../components/ui/hstack';
import {Button, ButtonText} from '../../components/ui/button';
import BillCard from '../../components/cards/BillCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/types/navigation';
import {BillData} from '../../types/types';
import {
  deleteBill,
  deleteGroup,
  getBills,
  getGroups,
  saveBill,
  saveGroup,
} from '../../utils/util';
import {useContext, useEffect, useMemo, useState} from 'react';
import EditDeleteAction from '../../components/other/EditDeleteAction';
import useOptimistic from '../../hooks/useOptimistic';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import MoreTotalModal from '../../components/modals/MoreTotalModal';
import RippleButton from '../../components/btns/RippleButton';
import useCustomToast from '../../hooks/useToast';
import EmptyImage from '../../assets/images/empty.png';
import {Image} from '../../components/ui/image';
import Groups from '../../components/other/Groups';
import AddGroupModal from '../../components/modals/AddGroupModal';
import {GlobalContext} from '../../../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>;

interface BillsOptimisticAction {
  type: 'delete' | 'update';
  id: string;
  data?: {
    name: string;
    value: string | number | boolean;
  };
}

const Home = ({navigation}: HomeProps) => {
  const {
    activeGroup: activeGroupContext,
    setActiveGroup: setActiveGroupContext,
  } = useContext(GlobalContext);
  const {showNewToast} = useCustomToast();

  const [groups, setGroups] = useState<string[]>([]);
  const [bills, setBills] = useState<BillData[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [activeGroup, setActiveGroup] = useState<string>('');

  const [isShowResetAllModal, setIsShowResetAllModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowTotalsModal, setIsShowTotalsModal] = useState(false);
  const [isShowAddGroupModal, setIsShowAddGroupModal] = useState(false);

  const [billsOpt, updateBillsOpt] = useOptimistic(
    bills,
    (curr, action: BillsOptimisticAction) => {
      if (action.type === 'delete') {
        return curr.filter(bill => bill.id !== action.id);
      }

      if (action.type === 'update') {
        if (!action.data) {
          return curr;
        }

        return curr.map(bill => {
          if (bill.id === action.id) {
            if (action.data && action.data.value !== undefined) {
              return {...bill, [action.data.name]: action.data.value};
            }
            return bill;
          }
          return bill;
        });
      }

      return curr;
    },
  );

  const total = useMemo(
    () => billsOpt.reduce((acc, curr) => acc + curr.amount, 0),
    [billsOpt],
  );

  const [showActionsheet, setShowActionsheet] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      const _groups = await getGroups();
      setGroups(_groups ?? []);

      if (_groups.length > 0) {
        const ag = activeGroupContext;

        const _bills = await getBills(ag || _groups?.[0]);
        setBills(_bills ?? []);

        setActiveGroup(ag || _groups?.[0] || '');
      }
    };

    fetchBills();
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      const _bills = await getBills(activeGroup);
      setBills(_bills ?? []);
    };

    fetchBills();
  }, [activeGroup]);

  const handleOnAddGroup = async (groupName: string) => {
    setGroups(prev => {
      return [...prev, groupName];
    });

    if (activeGroup === '') {
      setActiveGroup(groupName);
    }

    if (await saveGroup(groupName)) {
      showNewToast('New Group Added', 'Group added successfully');
    } else {
      showNewToast('Error', 'Failed to add group', 'err');
    }

    setIsShowAddGroupModal(false);
  };

  const handleOnCloseActionsheet = () => {
    setShowActionsheet(false);
    setSelectedBillId('');
  };

  const handleOnBillCardPress = (id: string) => {
    setSelectedBillId(id);
    setShowActionsheet(true);
  };

  const handleOnEditPress = () => {
    setShowActionsheet(false);
    navigation.navigate({
      name: 'AddBill',
      params: {id: selectedBillId, group: activeGroup},
    });
    setSelectedBillId('');
  };

  const handleOnPaidPress = async () => {
    updateBillsOpt({
      type: 'update',
      id: selectedBillId,
      data: {name: 'isPaid', value: true},
    });
    updateBillsOpt({
      type: 'update',
      id: selectedBillId,
      data: {name: 'amount', value: 0},
    });

    // the actual update function
    const billToUpdate = billsOpt.find(bill => bill.id === selectedBillId);
    let isSaved = false;
    if (billToUpdate) {
      isSaved = await saveBill(activeGroup, {
        ...billToUpdate,
        isPaid: true,
        amount: 0,
      });
    }

    setShowActionsheet(false);
    setSelectedBillId('');
    if (isSaved) {
      showNewToast('Paid Success', 'Mark the bill as paid successfully');
    } else {
      showNewToast('Error', 'Failed to mark the bill as paid', 'err');
    }
  };

  const handleOnResetAllPaidPress = async () => {
    let hasError = false;
    for (let i = 0; i < billsOpt.length; i++) {
      const bill = billsOpt[i];

      // updates the UI data
      updateBillsOpt({
        type: 'update',
        id: bill.id,
        data: {name: 'isPaid', value: false},
      });
      updateBillsOpt({
        type: 'update',
        id: bill.id,
        data: {name: 'amount', value: 0},
      });

      // the actual update function
      const billToUpdate = billsOpt.find(_bill => _bill.id === bill.id);
      if (billToUpdate) {
        hasError = hasError
          ? hasError
          : !(await saveBill(activeGroup, {
              ...billToUpdate,
              isPaid: false,
              amount: bill.amount,
            }));
      }
    }

    setIsShowResetAllModal(false);
    setSelectedBillId('');

    if (!hasError) {
      showNewToast(
        'Reset All Success',
        'Reset all the paid bills successfully',
      );
    } else {
      showNewToast('Error', 'Failed to reset all the paid bills', 'err');
    }
  };

  const handleResetPaidPress = async () => {
    updateBillsOpt({
      type: 'update',
      id: selectedBillId,
      data: {name: 'isPaid', value: false},
    });
    updateBillsOpt({
      type: 'update',
      id: selectedBillId,
      data: {name: 'amount', value: 0},
    });

    // the actual update function
    const billToUpdate = billsOpt.find(bill => bill.id === selectedBillId);
    let isSaved = false;
    if (billToUpdate) {
      isSaved = await saveBill(activeGroup, {
        ...billToUpdate,
        isPaid: false,
        amount: 0,
      });
    }

    setShowActionsheet(false);
    setSelectedBillId('');

    if (isSaved) {
      showNewToast('Reset Success', 'Reset the paid bill successfully');
    } else {
      showNewToast('Error', 'Failed to reset the paid bill', 'err');
    }
  };

  const handleOnDeleteBill = async () => {
    updateBillsOpt({type: 'delete', id: selectedBillId});
    // the actual delete function
    const isDeleted = await deleteBill(activeGroup, selectedBillId);
    setSelectedBillId('');
    setShowActionsheet(false);
    setIsShowDeleteModal(false);

    if (isDeleted) {
      showNewToast('Delete Success', 'Delete the bill successfully');
    } else {
      showNewToast('Error', 'Failed to delete the bill', 'err');
    }
  };

  const handleOnDeleteGroup = async (group: string) => {
    const updatedGroups = groups.filter(grp => grp !== group);
    setGroups(updatedGroups);

    // the actual delete function
    const isDeleted = await deleteGroup(group);
    setActiveGroup(updatedGroups[0] ?? '');

    if (isDeleted) {
      showNewToast('Delete Success', 'Delete the group successfully');
    } else {
      showNewToast('Error', 'Failed to delete the group', 'err');
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isShowDeleteModal}
        onClosed={() => setIsShowDeleteModal(false)}
        onNegativePressed={() => setIsShowDeleteModal(false)}
        onPositivePressed={handleOnDeleteBill}
        title="Delete Bill"
        description="Are you sure to delete the bill?"
      />

      <ConfirmationModal
        isOpen={isShowResetAllModal}
        onClosed={() => setIsShowResetAllModal(false)}
        onNegativePressed={() => setIsShowResetAllModal(false)}
        onPositivePressed={handleOnResetAllPaidPress}
        title="Reset All Paid"
        description="Are you sure to reset all the paid bills?"
      />

      <MoreTotalModal
        bills={billsOpt}
        isOpen={isShowTotalsModal}
        onClosed={() => setIsShowTotalsModal(false)}
        onPositivePressed={() => setIsShowTotalsModal(false)}
        title="Total By Tags"
      />

      <AddGroupModal
        isOpen={isShowAddGroupModal}
        title="Add Group +"
        onClosed={() => setIsShowAddGroupModal(false)}
        onNegativePressed={() => setIsShowAddGroupModal(false)}
        onPositivePressed={handleOnAddGroup}
      />

      <SafeAreaView className={clsx('p-5')}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

        <Box className={clsx('flex', 'h-full')}>
          <Heading className={clsx('text-4xl')}>Bills Manager</Heading>

          <HStack className={clsx('mt-7', 'items-center')}>
            <HStack space="sm" className={clsx('me-auto')}>
              <Text className={clsx('text-xl')}>Total:</Text>

              <Text
                className={clsx(
                  'text-xl',
                  'color-secondary-500',
                  'font-interbold',
                )}>
                ₱{total.toLocaleString()}
              </Text>
            </HStack>

            <RippleButton onPress={() => setIsShowTotalsModal(true)}>
              <Text className={clsx('text-xl')}>Show More</Text>
            </RippleButton>
          </HStack>

          <Box className={clsx('border-b-[1px]', 'mx-14', 'mt-6')} />

          <Groups
            groups={groups}
            activeGroup={activeGroup}
            onGroupNamePressed={group => {
              setActiveGroup(group);
              setActiveGroupContext(group);
            }}
            onAddGroupPressed={() => setIsShowAddGroupModal(true)}
            onDeleteGroupPressed={handleOnDeleteGroup}
          />

          {billsOpt.length > 0 && (
            <>
              <HStack>
                <RippleButton
                  onPress={() => setIsShowResetAllModal(true)}
                  className={clsx('mt-5')}>
                  <Text className={clsx('text-xl')}>Reset All Paid</Text>
                </RippleButton>
              </HStack>

              <FlatList
                data={billsOpt}
                renderItem={({item}) => (
                  <BillCard
                    key={item.id}
                    title={item.title}
                    tag={item.tag}
                    amount={item.amount.toLocaleString()}
                    isPaid={item.isPaid}
                    isSelected={selectedBillId === item.id}
                    onPress={() => handleOnBillCardPress(item.id)}
                  />
                )}
              />
            </>
          )}

          {billsOpt.length === 0 && (
            <Box
              className={clsx(
                'flex',
                'items-center',
                'justify-center',
                'mt-20',
              )}>
              <Image
                source={EmptyImage}
                className={clsx('w-28', 'h-28', 'mb-5', 'filter')}
                alt="Empty Image"
              />
              <Text>No added bills yet.</Text>
            </Box>
          )}

          {groups.length !== 0 && (
            <Button
              size="md"
              variant="solid"
              action="primary"
              className={clsx('mt-auto', 'mx-10', 'rounded-2xl', 'h-12')}
              onPress={() => {
                navigation.navigate({
                  name: 'AddBill',
                  params: {id: undefined, group: activeGroup},
                });
              }}>
              <ButtonText className={clsx('text-2xl', 'font-interbold')}>
                Add Bill
              </ButtonText>
            </Button>
          )}

          <EditDeleteAction
            isPaid={billsOpt.find(bill => bill.id === selectedBillId)?.isPaid}
            showActionsheet={showActionsheet}
            onClose={handleOnCloseActionsheet}
            onDeletePress={() => setIsShowDeleteModal(true)}
            onEditPress={handleOnEditPress}
            onPaidPress={handleOnPaidPress}
            onResetPress={handleResetPaidPress}
          />
        </Box>
      </SafeAreaView>
    </>
  );
};

export default Home;
