import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';

import 'tailwindcss/tailwind.css'
import './assets/globals.css'
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const container = document.getElementById('root') as HTMLDivElement

const root = createRoot(container);
const queryClient = new QueryClient();
root.render(
	<I18nextProvider i18n={i18n}>
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</QueryClientProvider>
	</I18nextProvider>
);
