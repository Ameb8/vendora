import { HexColorPicker } from 'react-colorful';

const ColorSelection = ({ data, update, nextStep, prevStep }) => {
    const handleChange = (key, value) => {
        update({ [key]: value });
    };

    return (
        <div>
            <h4 className="mb-3">Choose Your Brand Colors</h4>

            <div className="mb-4">
                <label className="form-label">Primary Color</label>
                <HexColorPicker color={data.primaryColor || '#000000'} onChange={(color) => handleChange('primaryColor', color)} />
                <p>Selected: {data.primaryColor}</p>
            </div>

            <div className="mb-4">
                <label className="form-label">Secondary Color</label>
                <HexColorPicker color={data.secondaryColor || '#000000'} onChange={(color) => handleChange('secondaryColor', color)} />
                <p>Selected: {data.secondaryColor}</p>
            </div>

            <div className="mb-4">
                <label className="form-label">Accent Color</label>
                <HexColorPicker color={data.accentColor || '#000000'} onChange={(color) => handleChange('accentColor', color)} />
                <p>Selected: {data.accentColor}</p>
            </div>

            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn btn-primary" onClick={nextStep}>Next</button>
            </div>
        </div>
    );
};

export default ColorSelection;
