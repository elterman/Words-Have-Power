import { useState, useRef } from 'react';

const useLongPress = () => {
    const [action, setAction] = useState();
    const timerRef = useRef();
    const isLongPress = useRef();

    const startPressTimer = () => {
        isLongPress.current = false;

        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            setAction('longpress');
        }, 400);
    };

    const handleClick = () => {
        if (isLongPress.current) {
            // console.log('Is long press - not continuing.');
            return;
        }

        setAction('click');
    };

    const handlePointerDown = () => {
        startPressTimer();
    };

    const handlePointerUp = () => {
        clearTimeout(timerRef.current);
    };

    return {
        action,
        handlers: {
            onClick: handleClick,
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
        }
    };
};

export default useLongPress;