const FilterIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <circle
            cx={7}
            cy={7}
            r={3}
            stroke="#222"
            strokeLinecap="round"
            transform="rotate(90 7 7)"
        />
        <path
            stroke="#222"
            strokeLinecap="round"
            d="M9.5 5H18a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H9.5"
        />
        <circle
            r={3}
            stroke="#222"
            strokeLinecap="round"
            transform="matrix(0 1 1 0 17 17)"
        />
        <path
            stroke="#222"
            strokeLinecap="round"
            d="M14.5 15H6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h8.5"
        />
    </svg>
)

export default FilterIcon
