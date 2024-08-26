package post;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/posts")
public class posts extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<PostClass> postList = new ArrayList<>();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lbms", "root", "root");

//            String sql = "SELECT PostId, Title, Content, Image, CreatedAt, UpdatedAt FROM Post";
            String sql = "SELECT PostId, Title, Content, Image, CreatedAt, UpdatedAt FROM Post ORDER BY CreatedAt DESC";

            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                ResultSet resultSet = statement.executeQuery();
                
                while (resultSet.next()) {
                    PostClass post = new PostClass();
                    post.setPostId(resultSet.getInt("PostId"));
                    post.setTitle(resultSet.getString("Title"));
                    post.setContent(resultSet.getString("Content"));

                    // Convert BLOB to Base64
                    Blob blob = resultSet.getBlob("Image");
                    if (blob != null) {
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        baos.write(blob.getBytes(1, (int) blob.length()));
                        String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());
                        post.setImageBase64(base64Image);
                    } else {
                        System.out.println("No image data for post with ID: " + resultSet.getInt("PostId"));
                    }

                    post.setCreatedAt(resultSet.getTimestamp("CreatedAt"));
                    post.setUpdatedAt(resultSet.getTimestamp("UpdatedAt"));
                    postList.add(post);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServletException("Database error: " + e.getMessage());
        }

        // Debugging: Check if the postList is populated
        if (postList.isEmpty()) {
            System.out.println("No posts found.");
        } else {
            System.out.println(postList.size() + " posts found.");
        }

        request.setAttribute("postList", postList);
        request.getRequestDispatcher("/post.jsp").forward(request, response);
    }
}
