import useGroupStore from "../../../store/useGroupStore";

const useCarouselHandler = () => {

  const {
    groups,
    setActiveGroupIdx,
    setActiveGroup,
  } = useGroupStore();

  const handleOnCarouselScrollEnd = (index: number) => {
    setActiveGroup(groups[index] || '');
    setActiveGroupIdx(index);
  }

  return {
    handleOnCarouselScrollEnd
  };
}

export default useCarouselHandler;