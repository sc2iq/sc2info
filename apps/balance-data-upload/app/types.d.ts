// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html
// DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement></InputHTMLAttributes>

declare global {
    interface DetailedHTMLProps {
        webkitdirectory: boolean
    }

    interface InputHTMLAttributes {
        webkitdirectory: boolean
    }

    interface HTMLInputElement {
        webkitdirectory: boolean
    }
}

export { }