import { JSX, ParentComponent, splitProps } from 'solid-js';
import './styles.scss';

export interface FocusRingProps {
    visible?: boolean;
    inward?: boolean;
    class?: string;
    style?: JSX.CSSProperties;
    children?: JSX.Element;
}

export const FocusRing: ParentComponent<FocusRingProps> = (props) => {
    const [local] = splitProps(props, ['visible', 'inward', 'class', 'style', 'children']);

    const rootClass = () => {
        const classes = ['md-focus-ring'];
        if (local.visible) classes.push('visible');
        if (local.inward) classes.push('inward');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <span class={rootClass()} style={local.style} aria-hidden="true" data-component="focus-ring">
            {local.children}
        </span>
    );
};

export default FocusRing;
