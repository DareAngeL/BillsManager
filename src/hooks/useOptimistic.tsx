import { useEffect, useState } from "react";

const useOptimistic = <T, P>(passthrough: T, reducer: (state: T, payload: P) => T): [T, (payload: P) => void] => {
    const [value, setValue] = useState(passthrough);

    useEffect(() => {
        setValue(passthrough);
    }, [passthrough]);

    return [value, (payload) => setValue((current) => reducer(current, payload))];
};

export default useOptimistic;
