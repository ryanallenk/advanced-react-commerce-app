import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;
export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetch the currently logged in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await signup().catch(console.error);
    resetForm();
    console.log(res);
    console.log({ data, loading, error });
  }

  return (
    <div>
      <Form method="POST" onSubmit={handleSubmit}>
        <h2>Request a Password Reset</h2>
        <DisplayError error={error} />
        <fieldset>
          {data?.sendUserPasswordResetLink === null && (
            <p> Success! Check your email for a password reset link. </p>
          )}
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Request Password Reset</button>
        </fieldset>
      </Form>
    </div>
  );
}
