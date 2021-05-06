import { useCallback, useEffect, useState } from 'react';

function useCountdown(seconds, runOnMount, onTimerZero) {
    const [timer, setTimer] = useState(seconds);
    const [running, setRunning] = useState(runOnMount);

    useEffect(() => {
        let interval;

        if (running) {
            interval = setInterval(() => {
                setTimer(prevState => {
                    if (prevState === 1) {
                        clearInterval(interval);
                        onTimerZero();
                    }
                    return prevState - 1;
                });
            }, 1000);;
        }
        else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running]);

    // Starts the countdown, only if not already running.
    const start = useCallback(() => {
        setRunning(prevState => {
            return prevState ? prevState : !prevState;
        });
    }, []);

    // Stops the countdown, only if already running.
    const stop = useCallback(() => {
        setRunning(prevState => {
            return prevState ? !prevState : prevState;
        });
    }, []);

    // Resets the countdown timer to initial props value.
    const reset = useCallback(() => {
        stop();
        setTimer(seconds);
        start();
    }, [seconds, start, stop]);

    return { timer, running, start, stop, reset };
}

export default useCountdown;