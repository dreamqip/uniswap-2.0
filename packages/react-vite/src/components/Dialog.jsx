import * as RadixDialog from '@radix-ui/react-dialog';

const Dialog = () => {
    return (
        <div>
            <RadixDialog.Root>
                <RadixDialog.Trigger />
                <RadixDialog.Portal>
                    <RadixDialog.Overlay />
                    <RadixDialog.Content>
                        <RadixDialog.Title />
                        <RadixDialog.Description />
                        <RadixDialog.Close />
                    </RadixDialog.Content>
                </RadixDialog.Portal>
            </RadixDialog.Root>
        </div>
    );
};

export default Dialog;