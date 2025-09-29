import eventBus from "../../../services/EventBus";

export enum CarouselHandlerEvent {
  ON_SCROLL_END = 'on-scroll-end',
}

const useCarouselHandler = () => {

  const handleOnCarouselScrollEnd = (index: number) => eventBus.emit(CarouselHandlerEvent.ON_SCROLL_END, index);

  return {
    handleOnCarouselScrollEnd
  };
}

export default useCarouselHandler;