/* eslint-disable react-hooks/exhaustive-deps */
import { Dimensions, StatusBar } from 'react-native';
import { Box } from '../../components/ui/box';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '../../components/ui/heading';
import clsx from 'clsx';
import { Text } from '../../components/ui/text';
import { HStack } from '../../components/ui/hstack';
import { Button, ButtonText } from '../../components/ui/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types/navigation';
import { useMemo, useRef, useState } from 'react';
import EditDeleteAction from '../../components/other/EditDeleteAction';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import MoreTotalModal from '../../components/modals/MoreTotalModal';
import RippleButton from '../../components/btns/RippleButton';
import EmptyImage from '../../assets/images/empty.png';
import { Image } from '../../components/ui/image';
import Groups from '../../components/other/Groups';
import AddGroupModal from '../../components/modals/AddGroupModal';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import CarouselRenderView from './CarouselRenderView';
import { useSharedValue } from 'react-native-reanimated';
import { VStack } from '../../components/ui/vstack';
import useGroupHandler, { GroupHandlerEvent } from './hooks/useGroupHandler';
import useBillHandler, { BillHandlerEvent } from './hooks/useBillHandler';
import { useEventAction } from '../../hooks/useEventAction';
import useActionSheetHandler, { ActionSheetEvent } from './hooks/useActionSheetHandler';
import useGroupStore from '../../store/useGroupStore';
import useBillStore from '../../store/useBillStore';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home', 'Stack'>;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = ({ navigation }: HomeProps) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const carouselProgress = useSharedValue<number>(0);

  const { handleOnAddGroup, handleOnDeleteGroup } = useGroupHandler();
  const { billsData, handleOnBillCardPress, handleOnResetAllPaidPress } = useBillHandler();
  const {
    showActionsheet,
    handleOnCloseActionsheet,
    handleOnDeleteActionPress,
    handleOnEditActionPress,
    handleOnPaidActionPress, 
    handleResetPaidActionPress
  } = useActionSheetHandler();

  const { groups, activeGroup, setActiveGroup, setActiveGroupIdx } = useGroupStore();
  const { selectedBillId, setSelectedBillId } = useBillStore();

  const [isShowResetAllModal, setIsShowResetAllModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowTotalsModal, setIsShowTotalsModal] = useState(false);
  const [isShowAddGroupModal, setIsShowAddGroupModal] = useState(false);

  const total = useMemo(
    () => billsData[activeGroup]?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
    [billsData],
  );

  useEventAction(ActionSheetEvent.ON_EDIT_BILL, () => {
    // Handle edit action
    navigation.navigate({
      name: 'AddBill',
      params: { id: selectedBillId, group: activeGroup },
    });
    setSelectedBillId('');
  });

  useEventAction(ActionSheetEvent.ON_DELETE_BILL, async () => {
    // Handle delete action
    setIsShowDeleteModal(false);
  });

  useEventAction(GroupHandlerEvent.ON_ADD_GROUP, () => {
    setIsShowAddGroupModal(false);
  });

  useEventAction(GroupHandlerEvent.ON_DELETE_GROUP, () => {
    setIsShowDeleteModal(false);
  });

  useEventAction(BillHandlerEvent.ON_PRESS_RESET_ALL_PAID, () => {
    setIsShowResetAllModal(false);
  });

  const handleOnCarouselScrollEnd = (index: number) => {
    // setActiveGroup(groups[index] || '');
    // setActiveGroupIdx(index);
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isShowDeleteModal}
        onClosed={() => setIsShowDeleteModal(false)}
        onNegativePressed={() => setIsShowDeleteModal(false)}
        onPositivePressed={handleOnDeleteActionPress}
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
        activeBills={billsData[activeGroup] || []}
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
            onGroupNamePressed={(group, index) => {
              setActiveGroupIdx(index);
              setActiveGroup(group);
            }}
            onAddGroupPressed={() => setIsShowAddGroupModal(true)}
            onDeleteGroupPressed={handleOnDeleteGroup}
          />

          {groups.length > 0 && (
            <VStack space='sm'>
              {billsData[activeGroup]?.length > 0 && (
                <HStack>
                  <RippleButton
                    onPress={() => setIsShowResetAllModal(true)}
                    className={clsx('mt-5')}>
                    <Text className={clsx('text-xl')}>Reset All Paid</Text>
                  </RippleButton>
                </HStack>
              )}

              <Carousel
                ref={carouselRef}
                width={screenWidth * 0.95}
                height={screenHeight * 0.58}
                style={{
                  width: screenWidth,
                  paddingBottom: 0,
                }}
                data={groups}
                loop={false}
                onProgressChange={carouselProgress}
                onScrollEnd={handleOnCarouselScrollEnd}
                renderItem={({ index }) => (
                  <CarouselRenderView
                    key={index}
                    renderIdx={index}
                    selectedBillId={selectedBillId}
                    handleOnBillCardPress={handleOnBillCardPress}
                    data={billsData}
                  />
                )}
              />
            </VStack>
          )}

          {groups.length === 0 && (
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
              <Text>No added groups yet.</Text>
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
                  params: { id: undefined, group: activeGroup },
                });
              }}>
              <ButtonText className={clsx('text-2xl', 'font-interbold')}>
                Add Bill
              </ButtonText>
            </Button>
          )}

          <EditDeleteAction
            isPaid={billsData[activeGroup]?.find(bill => bill.id === selectedBillId)?.isPaid}
            showActionsheet={showActionsheet}
            onClose={handleOnCloseActionsheet}
            onDeletePress={() => setIsShowDeleteModal(true)}
            onEditPress={handleOnEditActionPress}
            onPaidPress={handleOnPaidActionPress}
            onResetPress={handleResetPaidActionPress}
          />
        </Box>
      </SafeAreaView>
    </>
  );
};

export default Home;
