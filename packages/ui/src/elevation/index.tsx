import { JSX, ParentComponent, splitProps } from 'solid-js';
import './styles.scss';

export interface ElevationProps {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    class?: string;
    style?: JSX.CSSProperties;
    children?: JSX.Element;
}

export const Elevation: ParentComponent<ElevationProps> = (props) => {
    const [local] = splitProps(props, ['level', 'class', 'style', 'children']);

    const rootClass = () => {
        const classes = ['md-elevation', `level-${local.level ?? 1}`];
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={local.style} data-component="elevation" data-level={local.level ?? 1}>
            {local.children}
        </div>
    );
};

export default Elevation;
