import { forwardRef, useState } from "react";
import "./App.css";
import BetterSelect, {
    ArrowDown,
    TriggerProps,
} from "./components/BetterSelect";
import { ValueType } from "react-select";

export default () => {
    const [value, setValue] =
        useState<ValueType<{ id: number; label: string }, false>>();
    const options = [
        { id: 1, label: "Joey" },
        { id: 2, label: "Chandler" },
        { id: 3, label: "Rachel" },
        { id: 4, label: "Monica" },
    ];

    return (
        <div className="h-screen" style={{ height: "2000px" }}>
            <div className="h-[1000px] flex items-center justify-center">
                <BetterSelect
                    options={options}
                    trigger={Trigger}
                    getOptionLabel={(opt) => opt.label}
                    getOptionValue={(opt) => opt.id.toString()}
                    value={value}
                    onChange={(value) => setValue(value)}
                    placeholder="select value"
                />
            </div>
        </div>
    );
};

const Trigger = forwardRef(
    (props: TriggerProps<{ id: number; label: string }>, ref: any) => {
        return (
            <button
                onClick={props.toggleOpen}
                className="border border-gray-300 rounded px-4 py-2 flex gap-2 items-center"
                ref={ref}
            >
                {props.value?.label || props?.placeholder}
                <ArrowDown
                    className={`w-4 transition-transform duration-300 ${
                        props?.isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>
        );
    }
);
