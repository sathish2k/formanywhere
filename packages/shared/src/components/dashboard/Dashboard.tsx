/**
 * Dashboard Component — SolidJS
 * Main dashboard page with form management.
 * All state is centralized in DashboardProvider.
 */
import { Component } from 'solid-js';
import { Show } from 'solid-js';
import { CircularProgress } from '@formanywhere/ui/progress';
import { Typography } from '@formanywhere/ui/typography';
import './styles.scss';

import { DashboardProvider, useDashboard } from './DashboardProvider';
import { DashboardAppBar } from './header';
import { CreateFormSection } from './cards';
import { FormsListSection } from './FormsListSection';
import { NewFormDialog } from './NewFormDialog';

export interface DashboardProps {
    /** User ID from session/auth */
    userId?: string;
    /** User display name */
    userName?: string;
    /** User email */
    userEmail?: string;
}

/**
 * Inner dashboard content — must be rendered inside DashboardProvider.
 * Separated so it can call useDashboard() safely.
 */
const DashboardContent: Component<{ userName?: string; userEmail?: string }> = (props) => {
    const { loading, handleCreateForm, newFormDialogOpen, closeNewFormDialog, confirmNewForm } = useDashboard();
    const userName = () => props.userName || 'User';

    return (
        <div class="dashboard-page">
            <Show
                when={!loading()}
                fallback={
                    <div class="dashboard-loading">
                        <CircularProgress indeterminate />
                        <Typography variant="body-medium" color="on-surface-variant">
                            Loading your forms...
                        </Typography>
                    </div>
                }
            >
                <DashboardAppBar userName={userName()} userEmail={props.userEmail} />
                <div class="dashboard-container">
                    <CreateFormSection onSelectOption={handleCreateForm} />
                    <FormsListSection />
                </div>
            </Show>

            {/* Quick name dialog for new blank forms */}
            <NewFormDialog
                open={newFormDialogOpen()}
                onClose={closeNewFormDialog}
                onConfirm={confirmNewForm}
            />
        </div>
    );
};

/**
 * Public Dashboard component — wraps everything in the provider.
 */
export const Dashboard: Component<DashboardProps> = (props) => {
    return (
        <DashboardProvider
            userId={props.userId}
            userName={props.userName}
            userEmail={props.userEmail}
        >
            <DashboardContent userName={props.userName} userEmail={props.userEmail} />
        </DashboardProvider>
    );
};
