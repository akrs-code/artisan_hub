import { QuantityStepper } from '../../ui/quantity-stepper';

export const QuantityControl = ({ quantity, onDecrement, onIncrement, max }) => (
  <QuantityStepper 
    quantity={quantity} 
    onDecrement={onDecrement} 
    onIncrement={onIncrement} 
    max={max} 
    size="sm" 
  />
);
