import AddNewAddressRequest from './AddNewAddressRequest';

export default interface UpdateAddressRequest extends AddNewAddressRequest {
  id: string;
}
