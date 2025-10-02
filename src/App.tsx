import { CircularPagination } from '@features/CircularPagination';
import { extendedYears, extendedYears2 } from '@store/data'; // как у вас объявлено

export const App = () => {
	const titles: (string | null)[] = ['Первый', 'Второй', null, 'Четвертый', 'Пятый', 'Шестой'];
	const titles2: (string | null)[] = ['Первый', 'Второй', 'Третий'];

	return (
		<div className="container">
			<CircularPagination title="Исторические даты" blocks={extendedYears} titles={titles} />
			<CircularPagination title="Научные факты" blocks={extendedYears2} titles={titles2} />
		</div>
	);
};
