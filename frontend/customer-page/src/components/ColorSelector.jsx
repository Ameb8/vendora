import { useState } from 'react';
import { HsvColorPicker } from 'react-colorful';

export default function ColorPickerWheel() {
    const [color, setColor] = useState({ h: 0, s: 0, v: 0 });

    return (
        <div>
            <HsvColorPicker color={color} onChange={setColor} />
            <p>Selected HSV: {JSON.stringify(color)}</p>
        </div>
    );
}
