/**
 * Script for authentication
 * 
 * USAGE :     <div id="modal"/> (An element with ID = "modal" ) must have in host HTML page
 * 
 * How it work? : Inner HTML that are generated by mode are go into modal!
 * 
 * How it change mode? : Change URL param and it trigger UI updates.

 */

// function(mode){
//   return innerhtml with modex
// }

const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");

const getModalContent = (mode) => `
  <div id="" class="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
    <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <button id="authClose" class="absolute top-4 right-5 hover:bg-gray-300 rounded-sm px-4 py-2">
        Close
      </button>
      <h1 class="text-2xl font-bold mb-6 text-center text-[--secondary]">${
        mode === "SignUp" ? "Sign Up" : mode === "SignIn" ? "Sign In" : "Error"
      }</h1>
      <form action="authServlet" method="POST" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-[--secondary]">Name</label>
          <input type="text" id="name" name="name" class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-[--secondary]">Email</label>
          <input type="email" id="email" name="email" class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]">
        </div>
        ${
          mode == "SignUp"
            ? `
			<div>
			<label for="userType" class="block text-sm font-medium text-[--secondary]">User Type</label>
            <div class="flex mt-1">
                <select
                  id="userType"
                  name="userType"
                  class="mt-1 w-1/3 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]"
                >
                  <option value="KPTMYK">KPTMYK</option>
                  <option value="staff">Staff</option>
                </select>
                <input
                  type="text"
                  id="idOrDept"
                  name="idOrDept"
                  class="mt-1 p-2 w-2/3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]"
                  placeholder="Enter ID or Department"
                />
            </div></div>

            <input type="hidden" name="mode" value="SignUp">
          `
            : `<input type="hidden" name="mode" value="SignIn">`
        }
        <div>
          <label for="password" class="block text-sm font-medium text-[--secondary]">Password</label>
          <input type="password" id="password" name="password" class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]">
        </div>
        <button type="submit" class="w-full py-2 px-4 bg-[--secondary] text-white font-semibold rounded-md hover:bg-[--secondary] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary]">${
          mode === "SignUp" ? "Sign Up" : "Sign In"
        }</button>
      </form>
      <div class="space-y-2 text-xs text-right space-x-1">
		${
			mode === 'SignIn' ? `<span>Doesn't have an account?</span><button id="signUp" class="underline">Sign Up</button>`
        :
        `<span>Already have an account?</span><button id="signIn" class="underline">Sign In</button>`
		}
      </div>
    </div>
  </div>
`;

const updateURL = (mode) => {
  const url = new URL(window.location);
  url.searchParams.set("mode", mode);
  window.history.pushState({}, "", url);
};

const authModalToggler = (mode) => {
  modal.innerHTML = getModalContent(mode);
  updateURL(mode);

  const closeBtn = document.getElementById("authClose");
  const signUpBtn = document.getElementById("signUp");
  const signInBtn = document.getElementById("signIn");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.innerHTML = "";
      const url = new URL(window.location);
      url.searchParams.delete("mode");
      window.history.pushState({}, "", url);
    });
  }

  if (signUpBtn) {
    signUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authModalToggler("SignUp");
    });
  }

  if (signInBtn) {
    signInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authModalToggler("SignIn");
    });
  }
};


if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    const mode = openModalBtn.textContent.trim().replace(" ", "");
    authModalToggler(mode);
  });
}
