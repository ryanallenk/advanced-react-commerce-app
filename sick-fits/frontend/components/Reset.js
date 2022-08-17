import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;
export default function Reset({token}) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await reset().catch(console.error);
    resetForm();
    console.log(res);
    console.log({ data, loading, error });
  }

  return (
    <div>
      <Form method="POST" onSubmit={handleSubmit}>
        <h2>Reset your Password</h2>
        <DisplayError error={error || successfulError} />
        <fieldset>
          {data?.redeemUserPasswordResetToken === null && (
            <p> Success! You can now sign in. </p>
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
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Request Password Reset</button>
        </fieldset>
      </Form>
    </div>
  );
}
