import Back from './PNG/Back.png';
import Erase from './PNG/Erase.png';
import Example from './PNG/Example.png';
import Glasses from './PNG/Glasses.png';
import Human1 from './PNG/Human 1.png';
import Human2 from './PNG/Human 2.png';
import HumanRobot from './PNG/Human Robot.png';
import Humans from './PNG/Humans.png';
import Mail from './PNG/Mail.png';
import Pattern from './PNG/Pattern.png';
import Question from './PNG/Question.png';
import Restart from './PNG/Restart.png';
import RobotEyes from './PNG/Robot Eyes.png';
import Robot from './PNG/Robot.png';
import Settings from './PNG/Settings.png';
import SoundOff from './PNG/Sound Off.png';
import SoundOn from './PNG/Sound On.png';
import { START_PAGE } from './const';

const Preloader = (props) => {
    const { page: p = null } = props;

    return <div className='dummy' >
        {p === null && <img className='dummy' src={Pattern} alt='' />}
        {p === null && <img className='dummy' src={Humans} alt='' />}
        {p === null && <img className='dummy' src={HumanRobot} alt='' />}
        {p === null && <img className='dummy' src={Question} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Example} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Back} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Mail} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Human1} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Human2} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Robot} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Glasses} alt='' />}
        {p === START_PAGE && <img className='dummy' src={RobotEyes} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Erase} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Restart} alt='' />}
        {p === START_PAGE && <img className='dummy' src={Settings} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SoundOn} alt='' />}
        {p === START_PAGE && <img className='dummy' src={SoundOff} alt='' />}
    </div>;
};

export default Preloader;