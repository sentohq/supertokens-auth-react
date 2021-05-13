/// <reference types="react" />
export default function EmailPasswordAuthWrapper({
    children,
    requireAuth,
    recipeId,
}: {
    children: JSX.Element;
    requireAuth?: boolean;
    recipeId?: any;
}): JSX.Element;
