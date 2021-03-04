export const updateObject = (old, updatedProps) => {
    return {
        ...old,
        ...updatedProps
    };
};