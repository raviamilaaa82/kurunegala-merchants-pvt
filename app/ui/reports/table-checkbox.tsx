'use client';

export default function TableCheckbox({
    id,
    selected,
    toggleOne,
}: {
    id: number;
    selected: number[];
    toggleOne: (id: number) => void;
}) {
    return (
        <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => toggleOne(id)}
            className="rounded"
        />
    );
}