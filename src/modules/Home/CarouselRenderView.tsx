import { FlatList } from "react-native"
import { Box } from "../../components/ui/box"
import { BillData } from "../../types/types"
import BillCard from "../../components/cards/BillCard"
import { useMemo } from "react"
import clsx from "clsx"
import EmptyImage from '../../assets/images/empty.png';
import { Image } from "../../components/ui/image"
import { Text } from "../../components/ui/text"

interface CarouselRenderViewProps {
	renderIdx?: number
	selectedBillId: string | null
	handleOnBillCardPress: (id: string) => void
	data: { [group: string]: BillData[] }
}

const CarouselRenderView = ({
	renderIdx,
	selectedBillId,
	handleOnBillCardPress,
	data
}: CarouselRenderViewProps) => {

	const activeGroup = useMemo(() => Object.keys(data)[renderIdx || 0] || '', [data, renderIdx]);

	console.log('activeGroup', activeGroup, renderIdx, data);
	

	return (
		<Box key={renderIdx} className={clsx('me-4')}>
			{(!data[activeGroup] || data[activeGroup].length === 0) && (
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

			<FlatList
				data={data[activeGroup] || []}
				nestedScrollEnabled={true}
				scrollEventThrottle={16}
				renderItem={({ item }) => (
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
		</Box>
	)
}

export default CarouselRenderView