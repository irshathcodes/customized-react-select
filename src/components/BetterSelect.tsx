import { Placement } from "@popperjs/core";
import React, { forwardRef, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import Select, {
    StylesConfig,
    Props as ReactSelectProps,
    OptionTypeBase,
} from "react-select";

const selectStyles: StylesConfig<any, false> = {
    control: (provided) => ({
        ...provided,
        width: 200,
        margin: 8,
    }),
    menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" }),
};

// @ts-expect-error
export interface BetterSelectProps<
    OptionType extends OptionTypeBase = { label: string; value: string },
    IsMulti extends boolean = false
> extends ReactSelectProps<OptionType, IsMulti> {
    trigger: React.ForwardRefExoticComponent<TriggerProps<OptionType, IsMulti>>;
    toggleOpen?: () => void;
    menuPlacement?: Placement | undefined;
    menuWrapperClassName?: string;
}

export type TriggerProps<
    OptionType extends OptionTypeBase = { label: string; value: string },
    IsMulti extends boolean = false
> = React.PropsWithRef<
    ReactSelectProps<OptionType, IsMulti> & {
        toggleOpen: BetterSelectProps["toggleOpen"];
        isOpen?: boolean;
    }
>;

export default function BetterSelect<
    OptionType extends OptionTypeBase = { label: string; value: string },
    IsMulti extends boolean = false
>(props: BetterSelectProps<OptionType, IsMulti>) {
    const { trigger, onChange, menuPlacement, ...restProps } = props;
    const [isOpen, setIsOpen] = useState(() => !!props?.defaultMenuIsOpen);
    const [referenceElement, setReferenceElement] =
        useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
        null
    );

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 8],
                },
            },
        ],
        placement: menuPlacement || "bottom-start",
    });

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            const clickedInsideMenu =
                !!popperElement && popperElement.contains(e.target as Node);
            const clickedOnMenuButton =
                !!referenceElement &&
                referenceElement.contains(e.target as Node);

            if (!clickedInsideMenu && !clickedOnMenuButton) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [popperElement]);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const selectProps = { ...restProps, toggleOpen, isOpen };

    return (
        <div
            className={props?.menuWrapperClassName}
            style={{ position: "relative" }}
        >
            <props.trigger {...selectProps} ref={setReferenceElement} />
            {isOpen ? (
                <Menu
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <Select
                        autoFocus
                        backspaceRemovesValue={false}
                        components={{
                            DropdownIndicator,
                            IndicatorSeparator: null,
                        }}
                        controlShouldRenderValue={false}
                        hideSelectedOptions={false}
                        isClearable={false}
                        menuIsOpen
                        placeholder="Search..."
                        // @ts-expect-error
                        styles={selectStyles}
                        tabSelectsValue={false}
                        {...selectProps}
                        onChange={(value, meta) => {
                            onChange?.(value, meta);
                            setIsOpen(false);
                        }}
                    />
                </Menu>
            ) : null}
        </div>
    );
}

const Menu = forwardRef(
    (props: React.ComponentPropsWithRef<"div">, ref: any) => {
        const shadow = "hsla(218, 50%, 10%, 0.1)";
        return (
            <div
                {...props}
                style={{
                    backgroundColor: "white",
                    borderRadius: 4,
                    boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
                    ...(props.style || {}),
                }}
                ref={ref}
            />
        );
    }
);

const Svg = (p: JSX.IntrinsicElements["svg"]) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    <div style={{ color: "777777", height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);

export const ArrowDown = (props: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
    </svg>
);
