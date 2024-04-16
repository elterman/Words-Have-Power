
const ToolButton = (props) => {
    const { src, text, width, height, classes, style, disabled, grayscale, onClick } = props;
    const gridArea = '1/1';

    const pointerEvents = disabled ? 'none' : 'all';
    const filter = disabled || grayscale ? 'grayscale(100%)' : 'none';

    return <div className={`tool-button ${classes || ''}`} onClick={onClick}
        style={{ width, height: height || width, pointerEvents, ...style }} >
        {src ? <img style={{ gridArea, filter }} src={src} alt={text} width={width || 'unset'} /> : <span style={{ filter }}>{text}</span>}
    </div>;
};

export default ToolButton;