import { useCallback, useState } from 'react';

export const useForceUpdate = (timeout) => {
    const [, setState] = useState();
    const doSetState = () => setState({});

    return useCallback(() => {
        timeout && setTimeout(doSetState, 1);
        doSetState();
    }, [timeout]);
};
