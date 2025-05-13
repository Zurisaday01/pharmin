
import InventoryMovementTable from '@/components/tables/inventory-movement-table';
import { getAllInventoryMovements } from '@/lib/actions/inventory-movement.actions';

const MedicationsPage = async () => {
	const inventoryMovements = await getAllInventoryMovements();

	console.log('inventoryMovements', inventoryMovements);

	return (
		<>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Inventory Movement</h1>
				<p className='text-gray-500'>
					Analyse the movements made to the inventory.
				</p>
			</div>

			<InventoryMovementTable
				movements={(inventoryMovements?.data as unknown as InventoryMovement[]) || []}
			/>
		</>
	);
};
export default MedicationsPage;
