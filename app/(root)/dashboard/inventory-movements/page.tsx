import InventoryMovementTable from '@/components/tables/inventory-movement-table';
import TopConsumedMedications from '@/components/top-consumed-medications';
import { getAllInventoryMovements } from '@/lib/actions/inventory-movement.actions';
import { requireAdmin } from '@/lib/auth-guard';

const MedicationsPage = async () => {
	await requireAdmin();
	const inventoryMovements = await getAllInventoryMovements();

	return (
		<>
			<div className='mb-6 flex justify-between items-center'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-2xl font-bold'>Inventory Movement</h1>
					<p className='text-gray-500'>
						Analyse the movements made to the inventory.
					</p>
				</div>

				<TopConsumedMedications />
			</div>

			<InventoryMovementTable
				movements={
					(inventoryMovements?.data as unknown as InventoryMovement[]) || []
				}
			/>
		</>
	);
};
export default MedicationsPage;
