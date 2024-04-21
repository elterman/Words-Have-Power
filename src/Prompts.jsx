import { useAtom } from 'jotai';
import PromptPanel from './Prompt Panel';
import { a_flip, a_mode, a_over, a_restart, a_resume } from './atoms';
import { BLUEISH, HOT_PINK, LIME, MODE_ROBOT, X } from './const';
import useKeyboard from './useKeyboard';
import { defer } from './utils';

const Propmts = () => {
    const [mode] = useAtom(a_mode);
    const [over] = useAtom(a_over);
    const [resume] = useAtom(a_resume);
    const [flip] = useAtom(a_flip);
    const [restart, setRestart] = useAtom(a_restart);
    const { processKey } = useKeyboard();

    const dismiss = (cancel) => {
        setRestart(false);
        defer(() => document.querySelector('.App')?.focus());
    };

    const onResponse = (button) => {
        if (button === 1) {
            processKey('ENTER');
        } else {
            dismiss(true);
        }
    };

    let overPrompt = null;
    let border = `3px solid ${BLUEISH}`;
    const greenBorder = `3px solid ${LIME}`;
    const redBorder = `3px solid ${HOT_PINK}`;

    switch (over) {
        case 'won': overPrompt = 'More power to you!'; border = greenBorder; break;
        case 'lost': overPrompt = 'Overpowered!'; border = redBorder; break;
        case 'draw': overPrompt = 'Power draw!'; break;
        case 'player1wins': overPrompt = 'Player 1 strikes!'; border = greenBorder; break;
        case 'player2wins': overPrompt = 'Player 2 strikes!'; border = redBorder; break;
        default: break;
    }

    overPrompt = `${overPrompt} Play again?`;
    const done = over && !flip;

    return <>
        <PromptPanel labels={[overPrompt]} onClick={onResponse} show={done} buttonStyle={{ border }} />
        <PromptPanel labels={[`${mode === MODE_ROBOT ? 'Give up' : 'Start over'}?`, X]} onClick={onResponse} show={restart && !flip} />
        <PromptPanel labels={['RESUME']} onClick={onResponse} show={resume && !restart && !over} pulse buttonStyle={{ fontSize: '22px' }} />
    </>;
};

export default Propmts;